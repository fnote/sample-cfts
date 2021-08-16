# WindowsUpdate.ps1
# Run command: Powershell -File WindowsUpdate.ps1

$thisComputer = $env:COMPUTERNAME
$smtpServer = "intrelay.sysco.com"
$smtpFrom = "Owen.James@corp.sysco.com"
$smtpTo = "Owen.James@corp.sysco.com";
$messageSubject = "Windows Patching - " + $thisComputer + " - Update/Reboot Report"
$Message = New-Object System.Net.Mail.mailmessage $smtpFrom, $smtpTo
$Message.Subject = $messageSubject

#Define update criteria.
$Criteria = "IsInstalled=0 and Type='Software'"

#Stop MS SQL Server and setup Startup Type to Manual
Get-Service | Where {$_.Name –eq 'MSSQLSERVER'} | Set-Service -StartupType Manual
Get-Service | Where {$_.Name –eq 'MSSQLSERVER'} | Stop-Service –Force

#Search for relevant updates.
$Searcher = New-Object -ComObject Microsoft.Update.Searcher
$SearchResult = $Searcher.Search($Criteria).Updates
$SearchResultTitle = $Searcher.Search($Criteria).Updates | ft -a title
$SearchResultString = $SearchResultTitle | Out-String

#Download updates.
$Session = New-Object -ComObject Microsoft.Update.Session
$Downloader = $Session.CreateUpdateDownloader()
$Downloader.Updates = $SearchResult
$Downloader.Download()

#Install updates.
$Installer = New-Object -ComObject Microsoft.Update.Installer
$Installer.Updates = $SearchResult
$Result = $Installer.Install()

#Reboot if required by updates.
If ($Result.rebootRequired)
{
	$timeStamp = get-date -Format hh:mm
	$todaysDate = get-date -format D
	$RebootResult = "The server: " + $thisComputer + " has installed its updates and REQUIRES a reboot. 
	It began rebooting at:" + $timeStamp + " on " + $todaysDate + "

	Updates  
	{0}" -f $SearchResultString
	$Message.Body = $RebootResult
	$smtp = new-Object Net.Mail.SmtpClient($smtpServer)
	$smtp.Send($message)

	shutdown.exe /t 15 /r
}
If (!$Result.rebootRequired)
{
	#Start MS SQL Server
	Get-Service | Where {$_.Name –eq 'MSSQLSERVER'} | Start-Service
	$timeStamp = get-date -Format hh:mm
	$todaysDate = get-date -format D
	$RebootResult = "The server: " + $thisComputer + " has installed its updates and did NOT require a reboot.
	It finished installing its updates at:" + $timeStamp + " on " + $todaysDate + "

	Updates  
	{0}" -f $SearchResultString
	$Message.Body = $RebootResult
	# $smtp = new-Object Net.Mail.SmtpClient($smtpServer)
	# $smtp.Send($message)
}
