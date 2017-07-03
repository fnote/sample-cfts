{
  "AWSTemplateFormatVersion": "2010-09-09",
  "Description": "Deployed via Cloud-Pricing-Dev-01_v1",
  "Parameters": {
    "PONumber": {
      "Description": "PO Number for billing",
      "Type": "String",
      "Default": "7000000347",
      "MinLength": "1",
      "MaxLength": "255",
      "AllowedPattern": "[\\x20-\\x7E]*",
      "ConstraintDescription": "Must contain only ASCII characters."
    },
    "PvtSNc": {
      "Description": "Private subnet for confidential apps in us-east-1c",
      "Type": "String",
      "Default": "subnet-b61cbb9d"
    },
    "PvtSNd": {
      "Description": "Private subnet for confidential apps in us-east-1d",
      "Type": "String",
      "Default": "subnet-ea138a9d"
    },
    "PvtSNe": {
	  "Description" : "Private subnet for confidential apps in us-east-1e CIDR: 10.168.142.0/23",
      "Type": "String",
      "Default": "subnet-2512501f",
      "MinLength" : "1",
      "MaxLength" : "255",
      "ConstraintDescription" : "Must be a valid Private Subnet."
    },
    "VPCID": {
      "Description": "Name of and existing VPC",
      "Type": "String",
      "Default": "vpc-ff88269a"
    },
    "DevDBSG": {
      "Description": "DB security group",
      "Type": "String",
      "Default": "sg-fb6c6b9e"
    },
    "NATaccessSG": {
      "Description": "vpc-sysco-nonprod-02-NatAccess-T1IHRRI726WJ",
      "Type": "String",
      "Default": "sg-e151a186",
      "ConstraintDescription": "Must be a valid NAT Security Group."
    },
    "CheckMKSG": {
      "Description": "CheckMK Security Group",
      "Type": "String",
      "Default": "sg-0f7fc468",
      "ConstraintDescription": "Must be a valid NAT Security Group."
    },
    "ODAMI": {
      "Description": "AMI for OD servers",
      "Type": "String",
      "Default": "ami-a43d31cc"
    },
    "AMIUpdateProc": {
      "Description": "AMI for CP-UpdateProcessor-008 (ami-16119f01)",
      "Type": "String",
      "Default": "ami-16119f01"
    },
    "AMIMCP": {
      "Description" : "20170703-RHEL-7-2-CPBASE - ami-b5a79ea3",
      "Type" : "String",
      "Default" : "ami-b5a79ea3"
    },
    "PemKey": {
      "Description": "Name of and existing EC2 KeyPair to enable SSH access to the instance",
      "Type": "String",
      "Default": "Sysco-KP-CP-NonProd"
    },
    "PemKey2": {
      "Description": "Name of and existing EC2 KeyPair to enable SSH access to the instance",
      "Type": "String",
      "Default": "KeyPair-Sysco-CloudPricing-NonProd"
    },
    "InstanceProfileMCP": {
      "Description" : "Instance Profile Name for MCP",
      "Type" : "String",
      "Default" : "Application-CP-MCPServerRole"
    },
    "InstanceProfileUpdateServer": {
      "Description" : "Instance Profile Name for Update Server",
      "Type" : "String",
      "Default" : "Application-CP-UpdateServerRole"
    },
    "ApplicationName": {
      "Description": "Name of application",
      "Type": "String",
      "Default": "Cloud Pricing",
      "MinLength": "1",
      "MaxLength": "255",
      "AllowedPattern": "[\\x20-\\x7E]*",
      "ConstraintDescription": "Must contain only ASCII characters."
    },
    "ApplicationId": {
      "Description": "Application ID",
      "Type": "String",
      "Default": "APP-001151",
      "MinLength": "1",
      "MaxLength": "255",
      "AllowedPattern": "[\\x20-\\x7E]*",
      "ConstraintDescription": "Must contain only ASCII characters."
    },
    "Approver": {
      "Description": "Name of application approver",
      "Type": "String",
      "Default": "Owen.James@corp.sysco.com",
      "MinLength": "1",
      "MaxLength": "255"
    },
    "Owner": {
      "Description": "Name of application owner",
      "Type": "String",
      "Default": "Owen.James@corp.sysco.com Rowland.Mike@corp.sysco.com",
      "MinLength": "1",
      "MaxLength": "255"
    },
    "ProjectId": {
      "Description": "Project ID",
      "Type": "String",
      "Default": "BT.001176",
      "MinLength": "1",
      "MaxLength": "255",
      "AllowedPattern": "[\\x20-\\x7E]*",
      "ConstraintDescription": "Must contain only ASCII characters."
    },
    "Environment": {
      "Description": "Environment for application",
      "Type": "String",
      "Default": "Development",
      "AllowedValues": [
        "Sandbox",
        "Development",
        "Quality",
        "Staging",
        "Training",
        "Production"
      ],
      "ConstraintDescription": "Must be a valid environment."
    },
    "EnvironmentShort": {
      "Description": "Environment for application",
      "Type": "String",
      "Default": "DEV",
      "AllowedValues": [
        "DEV",
        "QA",
        "STG",
        "PROD"
      ],
      "ConstraintDescription": "Must be a valid environment."
    }
  },
  "Resources": {
	"PriceWebServiceGroup" : {
		"Type" : "AWS::AutoScaling::AutoScalingGroup",
		"Properties" : {
			"AvailabilityZones" : [ "us-east-1c", "us-east-1d" ],
			"LaunchConfigurationName" : { "Ref" : "PriceWebServiceLaunchConfig" },
			"MinSize" : "1",
			"DesiredCapacity" : "1",
			"MaxSize" : "2",
			"HealthCheckType": "ELB",
			"HealthCheckGracePeriod": "300",
			"VPCZoneIdentifier" : [ { "Ref" : "PvtSNc" }, { "Ref" : "PvtSNd" } ],
			"LoadBalancerNames" : [ { "Ref" : "PriceWebServiceELB" } ],
			"Tags" : [
				{ "Key" : "Name", "Value" : { "Fn::Join" : ["", ["CP Web Service AutoScaling-", { "Ref" : "EnvironmentShort" }]]}, "PropagateAtLaunch" : "true" },
				{ "Key" : "Application_Name", "Value" : { "Ref" : "ApplicationName" }, "PropagateAtLaunch" : "true" },
				{ "Key" : "Application_Id", "Value" : { "Ref" : "ApplicationId" }, "PropagateAtLaunch" : "true" },
				{ "Key" : "Environment", "Value" : { "Ref" : "Environment" }, "PropagateAtLaunch" : "true" },
				{ "Key" : "PO_Number", "Value" : { "Ref" : "PONumber" }, "PropagateAtLaunch" : "true" },
				{ "Key" : "Project_ID", "Value" : { "Ref" : "ProjectId" }, "PropagateAtLaunch" : "true" },
				{ "Key" : "Owner", "Value" : { "Ref" : "Owner" }, "PropagateAtLaunch" : "true" },
				{ "Key" : "Approver", "Value" : { "Ref" : "Approver" }, "PropagateAtLaunch" : "true" }
			]
		},
		"UpdatePolicy" : {
			"AutoScalingScheduledAction" : {
				"IgnoreUnmodifiedGroupSizeProperties" : "true"
			},
			"AutoScalingRollingUpdate" : {
				"MinInstancesInService" : "1",
				"MaxBatchSize" : "1",
				"PauseTime" : "PT5M",
				"WaitOnResourceSignals" : "false"
			}
		}
	},
	"PriceWebServiceLaunchConfig" : {
		"Type" : "AWS::AutoScaling::LaunchConfiguration",
		"Properties" : {
			"ImageId" : {"Ref" : "AMIMCP"},
			"InstanceType" : "r4.large",
			"KeyName" : { "Ref" : "PemKey2" },
			"SecurityGroups" : [{ "Ref" : "sgMCP" }, { "Ref" : "NATaccessSG" }, { "Ref" : "CheckMKSG" }],
			"IamInstanceProfile" : { "Ref" : "InstanceProfileMCP" },
			"BlockDeviceMappings" : [ {
				"DeviceName" : "/dev/sda1",
				"Ebs" : {
					"VolumeSize" : "60",
					"VolumeType" : "gp2"
				}
			} ],
			"UserData" : { "Fn::Base64" : { "Fn::Join" : ["", [
				"#!/bin/bash -v\n",
				"date > /home/ec2-user/starttime\n",
				"yum update -y aws-cfn-bootstrap\n",
				"yum update -y wget\n",
				"yum update -y curl\n",
				
				"# Set Timezone\n",
				"timedatectl set-timezone UTC\n",

				"# Install lsof locate and smbclient\n",
				"yum install -y sysstat lsof mlocate samba-client\n",

				"##############################################\n",
				"#Change hostname to include IP Address\n",
				"##############################################\n",
				"# hostname lx238cpwebsvc01d.na.sysco.net\n",
				"# echo lx238cpwebsvc01d.na.sysco.net > /etc/hostname","\n",
				"sh -c \"hostname  cpwebsvc-$(curl http://169.254.169.254/latest/meta-data/local-ipv4/ -s)d.na.sysco.net\"\n",
				"sh -c \"echo  cpwebsvc-$(curl http://169.254.169.254/latest/meta-data/local-ipv4/ -s)d.na.sysco.net\" > /etc/hostname\n",

				"####################################\n",
				"#Add Users to server\n",
				"####################################\n",
				"useradd -m -g aix -c \"James Owen, Cloud Enablement Team\" jowe6212\n",
				"useradd -m -g aix -c \"Mike Rowland, Enterprise Architect\" mrow7849\n",
				"useradd -m -g aix -c \"Fernando Nieto, App Dev\" fnie6886\n",
				"useradd -m -g aix -c \"Ravi Goli, App Dev\" rgol4427\n",

				"#Create Linux users and groups\n",
				"useradd svccp000 -p Cpaws000\n",
				"groupadd cloudpricing\n",
				"usermod svccp000 -a -G cloudpricing\n",
				"usermod svccp000 -a -G root\n",

				"####################################\n",
				"# Download and Install java\n",
				"####################################\n",
				"cd /tmp\n",
				"wget --no-cookies --no-check-certificate --header \"Cookie: gpw_e24=http%3A%2F%2Fwww.oracle.com%2F; oraclelicense=accept-securebackup-cookie\" \"http://download.oracle.com/otn-pub/java/jdk/8u131-b11/d54c1d3a095b4ff2b6607d096fa80163/jdk-8u131-linux-x64.rpm\"\n",
				"rpm -ivh jdk-8u131-linux-x64.rpm\n",

				"####################################\n",
				"# Increase open file limits\n",
				"####################################\n",
				"sh -c \"echo \\\"*   soft   nofile   10240\\\" >> /etc/security/limits.conf\"\n",
				"sh -c \"echo \\\"*   hard   nofile   20240\\\" >> /etc/security/limits.conf\"\n",

				"####################################\n",
				"# Install tomcat\n",
				"####################################\n",
				"groupadd tomcat\n",
				"useradd tomcat -b /app -g tomcat -e \"\"\n",
				"cd /tmp\n",
				"wget -O apache-tomcat-8.5.15.tar.gz http://archive.apache.org/dist/tomcat/tomcat-8/v8.5.15/bin/apache-tomcat-8.5.15.tar.gz\n",
				"tar xzf apache-tomcat-8.5.15.tar.gz\n",
				"mv apache-tomcat-8.5.15 /usr/local/tomcat8\n",

				"# Set System Environment and Tomcat JVM Heap size\n",
				"#-----------------------------------\n",
				"#sh -c \"echo 'export SERVER_ENVIRONMENT_VARIABLE=", { "Ref" : "EnvironmentShort" }, "'\" > /etc/profile.d/cpwebservice.sh\n",
				"sh -c \"echo 'SERVER_ENVIRONMENT_VARIABLE=\"", { "Ref" : "EnvironmentShort" }, "\"'\" >> /etc/environment\n",
				"#sh -c \"echo 'export CATALINA_OPTS=\\\"-Xms1024M -Xmx8196M\\\"'\" >> /etc/profile.d/cpwebservice.sh\n",
				"sh -c \"echo 'CATALINA_OPTS=\\\"-Xms1024M -Xmx8196M\\\"'\" >> /etc/environment\n",
				"sh -c \"echo 'CATALINA_HOME=\\\"/usr/local/tomcat8\\\"'\" >> /etc/environment\n",
				
				"####################################\n",
				"# Setting cronjobs for Tomcat\n",
				"####################################\n",
				"sh -c \"printf \\\"@reboot /bin/sleep 20; /settings/tomcat.sh start;\n45 12 * * * /settings/tomcat.sh restart;\n\\\" > /etc/cron.d/tomcat\n\" ",

				"# Set Tomcat to restart after every reboot\n",
				"sh -c echo \"@reboot logger \\\"SYSTEM REBOOTED..Starting Tomcat...\\\" && /usr/local/tomcat8/bin/startup.sh\" | crontab - \n",
				
				"# Set Tomcat Environment Variable\n",
				"#-----------------------------------\n",
				"# sh -c \"echo 'SERVER_ENVIRONMENT_VARIABLE=\"", { "Ref" : "EnvironmentShort" }, "\"'\" >> /usr/local/tomcat8/conf/tomcat.conf\n",

				"# Set Tomcat Set JVM Heap\n",
				"#-----------------------------------\n",
				"# sh -c \"echo 'JAVA_OPTS=\"-Xms1g -Xmx1g -XX:MaxPermSize=256m\"'\" >> /usr/local/tomcat8/conf/tomcat.conf\n",

				"# Start Tomcat\n",
				"#-----------------------------------\n",
				"/usr/local/tomcat8/bin/startup.sh\n",

				"####################################\n",
				"# Create settings folder\n",
				"####################################\n",
				"mkdir /settings\n",
				"mkdir /settings/properties\n",
				"mkdir /settings/logs\n",
				"chown svccp000 -R /settings\n",
				"chgrp -R -c cloudpricing /settings\n",
				"chmod -R -c 777 /settings\n",

				"####################################\n",
				"# Install Splunk Universal Forwarder\n",
				"####################################\n",
				"cd /tmp\n",
				"wget -O splunkforwarder-6.6.2-4b804538c686-linux-2.6-x86_64.rpm 'https://www.splunk.com/bin/splunk/DownloadActivityServlet?architecture=x86_64&platform=linux&version=6.6.2&product=universalforwarder&filename=splunkforwarder-6.6.2-4b804538c686-linux-2.6-x86_64.rpm&wget=true'\n",
				"chmod 744 splunkforwarder-6.6.2-4b804538c686-linux-2.6-x86_64.rpm\n",
				"rpm -i splunkforwarder-6.6.2-4b804538c686-linux-2.6-x86_64.rpm\n",
				"cd /opt/splunkforwarder\n",
				"./bin/splunk start --accept-license\n",
				"./bin/splunk enable boot-start\n",

				"# Configure to run as a deployment client\n",
				"#-----------------------------------\n",
				"./bin/splunk set deploy-poll splunkdeploy.na.sysco.net:8089 -auth admin:changeme\n",

				"# Configure forwarder to send logs to Splunk Indexer\n",
				"#-----------------------------------\n",
				"./bin/splunk add forward-server splunkindex.na.sysco.net:9997 -auth admin:changeme\n",
				"./bin/splunk restart\n",

				"####################################\n",
				"# Install CodeDeploy\n",
				"####################################\n",
				"yum install ruby -y\n",
				"wget https://aws-codedeploy-us-east-1.s3.amazonaws.com/latest/install\n",
				"chmod +x ./install\n",
				"./install auto\n",
				
				"date > /home/ec2-user/stoptime\n",
				"sleep 120",
				"reboot"
				]]}
			}
		}
	},
	"PriceWebServiceELB": {
		"Type": "AWS::ElasticLoadBalancing::LoadBalancer",
		"Properties": {
			"Subnets" : [{ "Ref" : "PvtSNc" },{ "Ref" : "PvtSNd" }],
			"LoadBalancerName" : { "Fn::Join" : ["", ["elb-cp-webservice-", { "Ref" : "EnvironmentShort" }]]},
			"Scheme": "internal",
			"CrossZone": "true",
			"SecurityGroups": [ { "Ref": "DevWEBSG" } ],
			"Listeners": [
				{
					"LoadBalancerPort": "80",
					"InstancePort": "8080",
					"Protocol": "HTTP"
				},
				{
					"LoadBalancerPort": "443",
					"InstancePort": "8080",
					"Protocol": "TCP"
				}
			],
			"HealthCheck": {
				"Target" : "HTTP:8080/",
				"HealthyThreshold": "3",
				"UnhealthyThreshold": "7",
				"Interval": "120",
				"Timeout": "15"
			},
			"Tags": [
				{ "Key" : "Name", "Value" : { "Fn::Join" : ["", ["CP-WebService-ELB-private-", { "Ref" : "EnvironmentShort" }]]}},
				{ "Key" : "Application_Name", "Value" : { "Ref" : "ApplicationName" } },
				{ "Key" : "Application_Id", "Value" : { "Ref" : "ApplicationId" } },
				{ "Key" : "Environment", "Value" : { "Ref" : "Environment" } },
				{ "Key" : "PO_Number", "Value" : { "Ref" : "PONumber" } },
				{ "Key" : "Project_ID", "Value" : { "Ref" : "ProjectId" } },
				{ "Key" : "Owner", "Value" : { "Ref" : "Owner" } },
				{ "Key" : "Approver", "Value" : { "Ref" : "Approver" } }
			]
		}
	},
	"PriceConsoleGroup" : {
		"Type" : "AWS::AutoScaling::AutoScalingGroup",
		"Properties" : {
			"AvailabilityZones" : [ "us-east-1c", "us-east-1d" ],
			"LaunchConfigurationName" : { "Ref" : "PriceConsoleLaunchConfig" },
			"MinSize" : "1",
			"DesiredCapacity" : "1",
			"MaxSize" : "2",
			"HealthCheckType": "ELB",
			"HealthCheckGracePeriod": "300",
			"VPCZoneIdentifier" : [ { "Ref" : "PvtSNc" }, { "Ref" : "PvtSNd" } ],
			"LoadBalancerNames" : [ { "Ref" : "PriceConsoleELB" } ],
			"Tags" : [
				{ "Key" : "Name", "Value" : { "Fn::Join" : ["", ["CP Console AutoScaling-", { "Ref" : "EnvironmentShort" }]]}, "PropagateAtLaunch" : "true" },
				{ "Key" : "Application_Name", "Value" : { "Ref" : "ApplicationName" }, "PropagateAtLaunch" : "true" },
				{ "Key" : "Application_Id", "Value" : { "Ref" : "ApplicationId" }, "PropagateAtLaunch" : "true" },
				{ "Key" : "Environment", "Value" : { "Ref" : "Environment" }, "PropagateAtLaunch" : "true" },
				{ "Key" : "PO_Number", "Value" : { "Ref" : "PONumber" }, "PropagateAtLaunch" : "true" },
				{ "Key" : "Project_ID", "Value" : { "Ref" : "ProjectId" }, "PropagateAtLaunch" : "true" },
				{ "Key" : "Owner", "Value" : { "Ref" : "Owner" }, "PropagateAtLaunch" : "true" },
				{ "Key" : "Approver", "Value" : { "Ref" : "Approver" }, "PropagateAtLaunch" : "true" }
			]
		},
		"UpdatePolicy" : {
			"AutoScalingScheduledAction" : {
				"IgnoreUnmodifiedGroupSizeProperties" : "true"
			},
			"AutoScalingRollingUpdate" : {
				"MinInstancesInService" : "1",
				"MaxBatchSize" : "1",
				"PauseTime" : "PT5M",
				"WaitOnResourceSignals" : "false"
			}
		}
	},
	"PriceConsoleLaunchConfig" : {
		"Type" : "AWS::AutoScaling::LaunchConfiguration",
		"Properties" : {
			"ImageId" : {"Ref" : "AMIMCP"},
			"InstanceType" : "t2.micro",
			"KeyName" : { "Ref" : "PemKey2" },
			"SecurityGroups" : [{ "Ref" : "sgMCP" }, { "Ref" : "NATaccessSG" }, { "Ref" : "CheckMKSG" }],
			"IamInstanceProfile" : { "Ref" : "InstanceProfileMCP" },
			"BlockDeviceMappings" : [ {
				"DeviceName" : "/dev/sda1",
				"Ebs" : {
					"VolumeSize" : "60",
					"VolumeType" : "gp2"
				}
			} ],
			"UserData" : { "Fn::Base64" : { "Fn::Join" : ["", [
				"#!/bin/bash -v\n",
				"date > /home/ec2-user/starttime\n",
				"yum update -y aws-cfn-bootstrap\n",
				"yum update -y wget\n",
				"yum update -y curl\n",
				
				"# Set Timezone\n",
				"timedatectl set-timezone UTC\n",

				"# Install lsof locate and smbclient\n",
				"yum install -y sysstat lsof mlocate samba-client\n",

				"##############################################\n",
				"#Change hostname to include IP Address\n",
				"##############################################\n",
				"# hostname lx238cpconsole01d.na.sysco.net\n",
				"# echo lx238cpconsole01d.na.sysco.net > /etc/hostname","\n",
				"sh -c \"hostname  cpconsole-$(curl http://169.254.169.254/latest/meta-data/local-ipv4/ -s)d.na.sysco.net\"\n",
				"sh -c \"echo  cpconsole-$(curl http://169.254.169.254/latest/meta-data/local-ipv4/ -s)d.na.sysco.net\" > /etc/hostname\n",

				"####################################\n",
				"#Add Users to server\n",
				"####################################\n",
				"useradd -m -g aix -c \"James Owen, Cloud Enablement Team\" jowe6212\n",
				"useradd -m -g aix -c \"Mike Rowland, Enterprise Architect\" mrow7849\n",
				"useradd -m -g aix -c \"Fernando Nieto, App Dev\" fnie6886\n",
				"useradd -m -g aix -c \"Ravi Goli, App Dev\" rgol4427\n",

				"#Create Linux users and groups\n",
				"useradd svccp000 -p Cpaws000\n",
				"groupadd cloudpricing\n",
				"usermod svccp000 -a -G cloudpricing\n",
				"usermod svccp000 -a -G root\n",

				"####################################\n",
				"# Download and Install java\n",
				"####################################\n",
				"cd /tmp\n",
				"wget --no-cookies --no-check-certificate --header \"Cookie: gpw_e24=http%3A%2F%2Fwww.oracle.com%2F; oraclelicense=accept-securebackup-cookie\" \"http://download.oracle.com/otn-pub/java/jdk/8u131-b11/d54c1d3a095b4ff2b6607d096fa80163/jdk-8u131-linux-x64.rpm\"\n",
				"rpm -ivh jdk-8u131-linux-x64.rpm\n",

				"####################################\n",
				"# Install tomcat\n",
				"####################################\n",
				"groupadd tomcat\n",
				"useradd tomcat -b /app -g tomcat -e \"\"\n",
				"cd /tmp\n",
				"wget -O apache-tomcat-8.5.15.tar.gz http://archive.apache.org/dist/tomcat/tomcat-8/v8.5.15/bin/apache-tomcat-8.5.15.tar.gz\n",
				"tar xzf apache-tomcat-8.5.15.tar.gz\n",
				"mv apache-tomcat-8.5.15 /usr/local/tomcat8\n",

				"####################################\n",
				"# Add CORS\n",
				"####################################\n",
				"oldpattern=\"</web-app>\"\n",
				"newpattern=\"<filter> <filter-name>CorsFilter</filter-name>  <filter-class>org.apache.catalina.filters.CorsFilter</filter-class></filter><filter-mapping>  <filter-name>CorsFilter</filter-name>  <url-pattern>/*</url-pattern></filter-mapping>  </web-app>\"\n",
				"filename=\"/usr/local/tomcat8/conf/web.xml\"\n",
				"sed -i \"s@$oldpattern@$newpattern@g\" $filename\n",

				"# Set System Environment and Tomcat JVM Heap size\n",
				"#-----------------------------------\n",
				"sh -c \"echo 'export SERVER_ENVIRONMENT_VARIABLE=", { "Ref" : "EnvironmentShort" }, "'\" > /etc/profile.d/cpconsole.sh\n",
				"sh -c \"echo 'SERVER_ENVIRONMENT_VARIABLE=", { "Ref" : "EnvironmentShort" }, "'\" >> /etc/environment\n",
				"sh -c \"echo 'CATALINA_OPTS=\\\"-Xms256M -Xmx512M\\\"'\" >> /etc/environment\n",
				"sh -c \"echo 'export CATALINA_OPTS=\\\"-Xms256M -Xmx512M\\\"'\" >> /etc/profile.d/cpconsole.sh\n",

				"# Set Tomcat Environment Variable\n",
				"#-----------------------------------\n",
				"# sh -c \"echo 'SERVER_ENVIRONMENT_VARIABLE=\"", { "Ref" : "EnvironmentShort" }, "\"'\" >> /usr/local/tomcat8/conf/tomcat.conf\n",

				"# Set Tomcat Set JVM Heap\n",
				"#-----------------------------------\n",
				"# sh -c \"echo 'JAVA_OPTS=\"-Xms1g -Xmx1g -XX:MaxPermSize=256m\"'\" >> /usr/local/tomcat8/conf/tomcat.conf\n",

				"# Start Tomcat\n",
				"#-----------------------------------\n",
				"/usr/local/tomcat8/bin/startup.sh\n",
				
				"####################################\n",
				"# Create settings folder\n",
				"####################################\n",
				"mkdir /settings\n",
				"mkdir /settings/properties\n",
				"mkdir /settings/logs\n",
				"chown svccp000 -R /settings\n",
				"chgrp -R -c cloudpricing /settings\n",
				"chmod -R -c 777 /settings\n",

				"####################################\n",
				"# Install Splunk Universal Forwarder\n",
				"####################################\n",
				"cd /tmp\n",
				"wget -O splunkforwarder-6.6.1-aeae3fe0c5af-linux-2.6-x86_64.rpm 'https://www.splunk.com/bin/splunk/DownloadActivityServlet?architecture=x86_64&platform=linux&version=6.6.1&product=universalforwarder&filename=splunkforwarder-6.6.1-aeae3fe0c5af-linux-2.6-x86_64.rpm&wget=true'\n",
				"chmod 744 splunkforwarder-6.6.1-aeae3fe0c5af-linux-2.6-x86_64.rpm\n",
				"rpm -i splunkforwarder-6.6.1-aeae3fe0c5af-linux-2.6-x86_64.rpm\n",
				"cd /opt/splunkforwarder\n",
				"./bin/splunk start --accept-license\n",
				"./bin/splunk enable boot-start\n",

				"# Configure to run as a deployment client\n",
				"#-----------------------------------\n",
				"./bin/splunk set deploy-poll splunkdeploy.na.sysco.net:8089 -auth admin:changeme\n",

				"# Configure forwarder to send logs to Splunk Indexer\n",
				"#-----------------------------------\n",
				"./bin/splunk add forward-server splunkindex.na.sysco.net:9997 -auth admin:changeme\n",
				"./bin/splunk restart\n",

				"####################################\n",
				"# Install CodeDeploy\n",
				"####################################\n",
				"yum install ruby -y\n",
				"wget https://aws-codedeploy-us-east-1.s3.amazonaws.com/latest/install\n",
				"chmod +x ./install\n",
				"./install auto\n",
				
				"date > /home/ec2-user/stoptime\n"
				]]}
			}
		}
	},
	"PriceConsoleELB": {
		"Type": "AWS::ElasticLoadBalancing::LoadBalancer",
		"Properties": {
			"Subnets" : [{ "Ref" : "PvtSNc" },{ "Ref" : "PvtSNd" }],
			"LoadBalancerName" : { "Fn::Join" : ["", ["elb-cp-console-", { "Ref" : "EnvironmentShort" }]]},
			"Scheme": "internal",
			"CrossZone": "true",
			"SecurityGroups": [ { "Ref": "DevWEBSG" } ],
			"Listeners": [
				{
					"LoadBalancerPort": "80",
					"InstancePort": "8080",
					"Protocol": "HTTP"
				},
				{
					"LoadBalancerPort": "443",
					"InstancePort": "8080",
					"Protocol": "TCP"
				}
			],
			"HealthCheck": {
				"Target" : "HTTP:8080/",
				"HealthyThreshold": "3",
				"UnhealthyThreshold": "2",
				"Interval": "120",
				"Timeout": "5"
			},
			"Tags": [
				{ "Key" : "Name", "Value" : { "Fn::Join" : ["", ["CP-Console-ELB-private-", { "Ref" : "EnvironmentShort" }]]}},
				{ "Key" : "Application_Name", "Value" : { "Ref" : "ApplicationName" } },
				{ "Key" : "Application_Id", "Value" : { "Ref" : "ApplicationId" } },
				{ "Key" : "Environment", "Value" : { "Ref" : "Environment" } },
				{ "Key" : "PO_Number", "Value" : { "Ref" : "PONumber" } },
				{ "Key" : "Project_ID", "Value" : { "Ref" : "ProjectId" } },
				{ "Key" : "Owner", "Value" : { "Ref" : "Owner" } },
				{ "Key" : "Approver", "Value" : { "Ref" : "Approver" } }
			]
		}
	},
    "DevWEBSG": {
      "Type": "AWS::EC2::SecurityGroup",
      "Properties": {
        "GroupDescription": "Dev web services security group",
        "VpcId": { "Ref": "VPCID" },
        "SecurityGroupIngress": [
          {
            "IpProtocol": "tcp",
            "FromPort": "80",
            "ToPort": "80",
            "CidrIp": "10.0.0.0/8"
          },
          {
            "IpProtocol": "tcp",
            "FromPort": "443",
            "ToPort": "443",
            "CidrIp": "10.0.0.0/8"
          },
          {
            "IpProtocol": "tcp",
            "FromPort": "3389",
            "ToPort": "3389",
            "CidrIp": "10.0.0.0/8"
          }
        ],
        "Tags": [
			{ "Key" : "Name", "Value" : "sg/vpc_sysco_nonprod_02/cp_web_dev" },
			{ "Key" : "Application_Id", "Value" : { "Ref": "ApplicationId" } },
			{ "Key" : "Application_Name", "Value" : { "Ref" : "ApplicationName" } },
			{ "Key" : "Environment", "Value":  { "Ref": "Environment" } },
			{ "Key" : "PO_Number", "Value" : { "Ref": "PONumber" } },
			{ "Key" : "Project_ID", "Value" : { "Ref": "ProjectId" } },
			{ "Key" : "Owner", "Value" : { "Ref": "Owner" } },
			{ "Key" : "Approver", "Value" : { "Ref": "Approver" } }
        ]
      }
    },
    "IngressAdder1": {
      "DependsOn": "DevWEBSG",
      "Type": "AWS::EC2::SecurityGroupIngress",
      "Properties": {
        "FromPort": "-1",
        "GroupId": { "Ref": "DevWEBSG" },
        "IpProtocol": "-1",
        "SourceSecurityGroupId": { "Ref": "DevWEBSG" },
        "ToPort": "-1"
      }
    },
	"lx238cpmcp05d" : {
		"Type" : "AWS::EC2::Instance",
		"Properties" : {
			"AvailabilityZone" : "us-east-1d",
			"ImageId" : {"Ref" : "AMIMCP"},
			"InstanceType" : "t2.medium",
			"KeyName" : { "Ref" : "PemKey2" },
			"SecurityGroupIds" : [{ "Ref" : "sgMCP" }, { "Ref" : "NATaccessSG" }, { "Ref" : "CheckMKSG" }],
			"IamInstanceProfile" : { "Ref" : "InstanceProfileMCP" },
			"SubnetId": { "Ref": "PvtSNd" },
			"BlockDeviceMappings" : [ {
				"DeviceName" : "/dev/sda1",
				"Ebs" : {
					"VolumeSize" : "60",
					"VolumeType" : "gp2"
				}
			} ],
			"Tags" : [
				{ "Key" : "Name", "Value" : "lx238cpmcp05d" },
				{ "Key" : "Application_Name", "Value" : { "Ref" : "ApplicationName" } },
				{ "Key" : "Application_Id", "Value" : { "Ref" : "ApplicationId" } },
				{ "Key" : "Environment", "Value" : { "Ref" : "Environment" } },
				{ "Key" : "PO_Number", "Value" : { "Ref" : "PONumber" } },
				{ "Key" : "Project_ID", "Value" : { "Ref" : "ProjectId" } },
				{ "Key" : "Owner", "Value" : { "Ref" : "Owner" } },
				{ "Key" : "Approver", "Value" : { "Ref" : "Approver" } }
			],
			"UserData" : { "Fn::Base64" : { "Fn::Join" : ["", [
				"#!/bin/bash -v\n",
				"date > /home/ec2-user/starttime\n",
				"yum update -y aws-cfn-bootstrap\n",
				"yum update -y wget\n",
				"yum update -y curl\n",
				
				"# Set Timezone\n",
				"timedatectl set-timezone UTC\n",

				"# Install lsof locate and smbclient\n",
				"yum install -y sysstat lsof mlocate samba-client\n",

				"#Change Name of server to match new hostname\n",
				"hostname lx238cpmcp05d.na.sysco.net\n",
				"echo lx238cpmcp05d.na.sysco.net > /etc/hostname","\n",
				"# sh -c \"hostname  cpmcp-$(curl http://169.254.169.254/latest/meta-data/local-ipv4/ -s)d.na.sysco.net\"\n",
				"#sh -c \"echo  cpmcp-$(curl http://169.254.169.254/latest/meta-data/local-ipv4/ -s)d.na.sysco.net\" > /etc/hostname\n",

				"####################################\n",
				"#Add Users to server\n",
				"####################################\n",
				"useradd -m -g aix -c \"James Owen, Cloud Enablement Team\" jowe6212\n",
				"useradd -m -g aix -c \"Mike Rowland, Enterprise Architect\" mrow7849\n",
				"useradd -m -g aix -c \"Fernando Nieto, App Dev\" fnie6886\n",
				"useradd -m -g aix -c \"Ravi Goli, App Dev\" rgol4427\n",

				"####################################\n",
				"# Download and Install java\n",
				"####################################\n",
				"cd /tmp\n",
				"wget --no-cookies --no-check-certificate --header \"Cookie: gpw_e24=http%3A%2F%2Fwww.oracle.com%2F; oraclelicense=accept-securebackup-cookie\" \"http://download.oracle.com/otn-pub/java/jdk/8u131-b11/d54c1d3a095b4ff2b6607d096fa80163/jdk-8u131-linux-x64.rpm\"\n",
				"rpm -ivh jdk-8u131-linux-x64.rpm\n",

				"####################################\n",
				"# Install tomcat\n",
				"####################################\n",
				"groupadd tomcat\n",
				"useradd tomcat -b /app -g tomcat -e \"\"\n",
				"cd /tmp\n",
				"wget -O apache-tomcat-8.5.15.tar.gz http://archive.apache.org/dist/tomcat/tomcat-8/v8.5.15/bin/apache-tomcat-8.5.15.tar.gz\n",
				"tar xzf apache-tomcat-8.5.15.tar.gz\n",
				"mv apache-tomcat-8.5.15 /usr/local/tomcat8\n",

				"# Set System Environment and Tomcat JVM Heap size\n",
				"#-----------------------------------\n",
				"sh -c \"echo 'export SERVER_ENVIRONMENT_VARIABLE=", { "Ref" : "EnvironmentShort" }, "'\" > /etc/profile.d/cpmcp.sh\n",
				"sh -c \"echo 'export CATALINA_OPTS=\\\"-Xms512M -Xmx2048M\\\"'\" >> /etc/profile.d/cpmcp.sh\n",
				"sh -c \"echo 'SERVER_ENVIRONMENT_VARIABLE=", { "Ref" : "EnvironmentShort" }, "'\" > /etc/environment\n",
				"sh -c \"echo 'CATALINA_OPTS=\\\"-Xms512M -Xmx2048M\\\"'\" >> /etc/environment\n",
				
				"# Set Tomcat Environment Variable\n",
				"# sh -c \"echo 'SERVER_ENVIRONMENT_VARIABLE=\"", { "Ref" : "EnvironmentShort" }, "\"'\" >> /usr/local/tomcat8/conf/tomcat.conf\n",

				"# Set Tomcat Set JVM Heap\n",
				"# sh -c \"echo 'JAVA_OPTS=\"-Xms1g -Xmx1g -XX:MaxPermSize=256m\"'\" >> /usr/local/tomcat8/conf/tomcat.conf\n",

				"# Start Tomcat\n",
				"# /usr/local/tomcat8/bin/startup.sh\n",

				"# Create settings folder\n",
				"mkdir /settings\n",
				"mkdir /settings/properties\n",
				"mkdir /settings/logs\n",
				"chown tomcat -R /settings\n",
				"chgrp -R -c ec2-user /settings\n",
				"chmod -R -c 777 /settings\n",

				"####################################\n",
				"# Install Splunk Universal Forwarder\n",
				"####################################\n",
				"cd /tmp\n",
				"wget -O splunkforwarder-6.6.1-aeae3fe0c5af-linux-2.6-x86_64.rpm 'https://www.splunk.com/bin/splunk/DownloadActivityServlet?architecture=x86_64&platform=linux&version=6.6.1&product=universalforwarder&filename=splunkforwarder-6.6.1-aeae3fe0c5af-linux-2.6-x86_64.rpm&wget=true'\n",
				"chmod 744 splunkforwarder-6.6.1-aeae3fe0c5af-linux-2.6-x86_64.rpm\n",
				"rpm -i splunkforwarder-6.6.1-aeae3fe0c5af-linux-2.6-x86_64.rpm\n",
				"cd /opt/splunkforwarder\n",
				"./bin/splunk start --accept-license\n",
				"./bin/splunk enable boot-start\n",

				"# Configure to run as a deployment client\n",
				"#-----------------------------------\n",
				"./bin/splunk set deploy-poll splunkdeploy.na.sysco.net:8089 -auth admin:changeme\n",

				"# Configure forwarder to send logs to Splunk Indexer\n",
				"#-----------------------------------\n",
				"./bin/splunk add forward-server splunkindex.na.sysco.net:9997 -auth admin:changeme\n",
				"./bin/splunk restart\n",

				"####################################\n",
				"# Install CodeDeploy\n",
				"####################################\n",
				"yum install ruby -y\n",
				"wget https://aws-codedeploy-us-east-1.s3.amazonaws.com/latest/install\n",
				"chmod +x ./install\n",
				"./install auto\n",
				
				"date > /home/ec2-user/stoptime\n"
				]]}
			}
		}
	},
	"lx238cpmcp04d" : {
		"Type" : "AWS::EC2::Instance",
		"Properties" : {
			"AvailabilityZone" : "us-east-1d",
			"ImageId" : {"Ref" : "AMIMCP"},
			"InstanceType" : "t2.medium",
			"KeyName" : { "Ref" : "PemKey2" },
			"SecurityGroupIds" : [{ "Ref" : "sgMCP" }, { "Ref" : "NATaccessSG" }, { "Ref" : "CheckMKSG" }],
			"IamInstanceProfile" : { "Ref" : "InstanceProfileMCP" },
			"SubnetId": { "Ref": "PvtSNd" },
			"BlockDeviceMappings" : [ {
				"DeviceName" : "/dev/sda1",
				"Ebs" : {
					"VolumeSize" : "60",
					"VolumeType" : "gp2"
				}
			} ],
			"Tags" : [
				{ "Key" : "Name", "Value" : "lx238cpmcp04d" },
				{ "Key" : "Application_Name", "Value" : { "Ref" : "ApplicationName" } },
				{ "Key" : "Application_Id", "Value" : { "Ref" : "ApplicationId" } },
				{ "Key" : "Environment", "Value" : { "Ref" : "Environment" } },
				{ "Key" : "PO_Number", "Value" : { "Ref" : "PONumber" } },
				{ "Key" : "Project_ID", "Value" : { "Ref" : "ProjectId" } },
				{ "Key" : "Owner", "Value" : { "Ref" : "Owner" } },
				{ "Key" : "Approver", "Value" : { "Ref" : "Approver" } }
			],
			"UserData" : { "Fn::Base64" : { "Fn::Join" : ["", [
				"#!/bin/bash -v\n",
				"date > /home/ec2-user/starttime\n",
				"yum update -y aws-cfn-bootstrap\n",
				"yum update -y wget\n",
				"yum update -y curl\n",
				
				"# Set Timezone\n",
				"timedatectl set-timezone UTC\n",

				"# Install lsof locate and smbclient\n",
				"yum install -y sysstat lsof mlocate samba-client\n",

				"#Change Name of server to match new hostname\n",
				"hostname lx238cpmcp04d.na.sysco.net\n",
				"echo lx238cpmcp04d.na.sysco.net > /etc/hostname","\n",
				"# sh -c \"hostname  cpmcp-$(curl http://169.254.169.254/latest/meta-data/local-ipv4/ -s)d.na.sysco.net\"\n",
				"#sh -c \"echo  cpmcp-$(curl http://169.254.169.254/latest/meta-data/local-ipv4/ -s)d.na.sysco.net\" > /etc/hostname\n",

				"#Add Users to server\n",
				"useradd -m -g aix -c \"Ezequiel Pitty, 2ndWatch Team\" zpit7073\n",
				"useradd -m -g aix -c \"James Owen, Cloud Enablement Team\" jowe6212\n",
				"useradd -m -g aix -c \"Mike Rowland, Enterprise Architect\" mrow7849\n",
				"useradd -m -g aix -c \"Ravi Goli, App Dev\" rgol4427\n",

				"# Download and Install java\n",
				"cd /tmp\n",
				"wget --no-cookies --no-check-certificate --header \"Cookie: gpw_e24=http%3A%2F%2Fwww.oracle.com%2F; oraclelicense=accept-securebackup-cookie\" \"http://download.oracle.com/otn-pub/java/jdk/8u131-b11/d54c1d3a095b4ff2b6607d096fa80163/jdk-8u131-linux-x64.rpm\"\n",
				"rpm -ivh jdk-8u131-linux-x64.rpm\n",

				"# Install tomcat\n",
				"groupadd tomcat\n",
				"useradd tomcat -b /app -g tomcat -e \"\"\n",
				"cd /tmp\n",
				"wget -O apache-tomcat-8.5.15.tar.gz http://archive.apache.org/dist/tomcat/tomcat-8/v8.5.15/bin/apache-tomcat-8.5.15.tar.gz\n",
				"tar xzf apache-tomcat-8.5.15.tar.gz\n",
				"mv apache-tomcat-8.5.15 /usr/local/tomcat8\n",

				"# Set System Environment and Tomcat JVM Heap size\n",
				"#-----------------------------------\n",
				"sh -c \"echo 'export SERVER_ENVIRONMENT_VARIABLE=", { "Ref" : "EnvironmentShort" }, "'\" > /etc/profile.d/cpmcp.sh\n",
				"sh -c \"echo 'export CATALINA_OPTS=\\\"-Xms512M -Xmx2048M\\\"'\" >> /etc/profile.d/cpmcp.sh\n",
				"sh -c \"echo 'SERVER_ENVIRONMENT_VARIABLE=", { "Ref" : "EnvironmentShort" }, "'\" > /etc/environment\n",
				"sh -c \"echo 'CATALINA_OPTS=\\\"-Xms512M -Xmx2048M\\\"'\" >> /etc/environment\n",
				
				"# Set Tomcat Environment Variable\n",
				"# sh -c \"echo 'SERVER_ENVIRONMENT_VARIABLE=\"", { "Ref" : "EnvironmentShort" }, "\"'\" >> /usr/local/tomcat8/conf/tomcat.conf\n",

				"# Set Tomcat Set JVM Heap\n",
				"# sh -c \"echo 'JAVA_OPTS=\"-Xms1g -Xmx1g -XX:MaxPermSize=256m\"'\" >> /usr/local/tomcat8/conf/tomcat.conf\n",

				"# Start Tomcat\n",
				"# /usr/local/tomcat8/bin/startup.sh\n",

				"# Create settings folder\n",
				"mkdir /settings\n",
				"mkdir /settings/properties\n",
				"mkdir /settings/logs\n",
				"chown tomcat -R /settings\n",
				"chgrp -R -c ec2-user /settings\n",
				"chmod -R -c 777 /settings\n",

				"####################################\n",
				"# Install Splunk Universal Forwarder\n",
				"####################################\n",
				"cd /tmp\n",
				"wget -O splunkforwarder-6.6.1-aeae3fe0c5af-linux-2.6-x86_64.rpm 'https://www.splunk.com/bin/splunk/DownloadActivityServlet?architecture=x86_64&platform=linux&version=6.6.1&product=universalforwarder&filename=splunkforwarder-6.6.1-aeae3fe0c5af-linux-2.6-x86_64.rpm&wget=true'\n",
				"chmod 744 splunkforwarder-6.6.1-aeae3fe0c5af-linux-2.6-x86_64.rpm\n",
				"rpm -i splunkforwarder-6.6.1-aeae3fe0c5af-linux-2.6-x86_64.rpm\n",
				"cd /opt/splunkforwarder\n",
				"./bin/splunk start --accept-license\n",
				"./bin/splunk enable boot-start\n",

				"# Configure to run as a deployment client\n",
				"#-----------------------------------\n",
				"./bin/splunk set deploy-poll splunkdeploy.na.sysco.net:8089 -auth admin:changeme\n",

				"# Configure forwarder to send logs to Splunk Indexer\n",
				"#-----------------------------------\n",
				"./bin/splunk add forward-server splunkindex.na.sysco.net:9997 -auth admin:changeme\n",
				"./bin/splunk restart\n",

				"####################################\n",
				"# Install CodeDeploy\n",
				"####################################\n",
				"yum install ruby -y\n",
				"wget https://aws-codedeploy-us-east-1.s3.amazonaws.com/latest/install\n",
				"chmod +x ./install\n",
				"./install auto\n",
				
				"date > /home/ec2-user/stoptime\n"
				]]}
			}
		}
	},
	"lx238cpsync01d" : {
		"Type" : "AWS::EC2::Instance",
		"Properties" : {
			"AvailabilityZone" : "us-east-1d",
			"ImageId" : {"Ref" : "AMIMCP"},
			"InstanceType" : "t2.medium",
			"KeyName" : { "Ref" : "PemKey2" },
			"SecurityGroupIds" : [{ "Ref" : "sgMCP" }, { "Ref" : "NATaccessSG" }, { "Ref" : "CheckMKSG" }],
			"IamInstanceProfile" : { "Ref" : "InstanceProfileMCP" },
			"SubnetId": { "Ref": "PvtSNd" },
			"BlockDeviceMappings" : [ {
				"DeviceName" : "/dev/sda1",
				"Ebs" : {
					"VolumeSize" : "60",
					"VolumeType" : "gp2"
				}
			} ],
			"Tags" : [
				{ "Key" : "Name", "Value" : "lx238cpsync01d" },
				{ "Key" : "Application_Name", "Value" : { "Ref" : "ApplicationName" } },
				{ "Key" : "Application_Id", "Value" : { "Ref" : "ApplicationId" } },
				{ "Key" : "Environment", "Value" : { "Ref" : "Environment" } },
				{ "Key" : "PO_Number", "Value" : { "Ref" : "PONumber" } },
				{ "Key" : "Project_ID", "Value" : { "Ref" : "ProjectId" } },
				{ "Key" : "Owner", "Value" : { "Ref" : "Owner" } },
				{ "Key" : "Approver", "Value" : { "Ref" : "Approver" } }
			],
			"UserData" : { "Fn::Base64" : { "Fn::Join" : ["", [
				"#!/bin/bash -v\n",
				"date > /home/ec2-user/starttime\n",
				"yum update -y aws-cfn-bootstrap\n",
				"yum update -y wget\n",
				"yum update -y curl\n",
				
				"# Set Timezone\n",
				"timedatectl set-timezone UTC\n",

				"# Install lsof locate and smbclient\n",
				"yum install -y sysstat lsof mlocate samba-client\n",

				"##############################################\n",
				"#Change hostname to include IP Address\n",
				"##############################################\n",
				"hostname lx238cpsync01d.na.sysco.net\n",
				"echo lx238cpsync01d.na.sysco.net > /etc/hostname","\n",
				"# sh -c \"hostname  cpsync-$(curl http://169.254.169.254/latest/meta-data/local-ipv4/ -s)d.na.sysco.net\"\n",
				"#sh -c \"echo  cpsync-$(curl http://169.254.169.254/latest/meta-data/local-ipv4/ -s)d.na.sysco.net\" > /etc/hostname\n",

				"#Add Users to server\n",
				"useradd -m -g aix -c \"James Owen, Cloud Enablement Team\" jowe6212\n",
				"useradd -m -g aix -c \"Mike Rowland, Enterprise Architect\" mrow7849\n",
				"useradd -m -g aix -c \"Fernando Nieto, App Dev\" fnie6886\n",

				"#Create Linux users and groups\n",
				"useradd svccp000 -p Cpaws000\n",
				"groupadd cloudpricing\n",
				"usermod svccp000 -a -G cloudpricing\n",
				"usermod svccp000 -a -G root\n",

				"####################################\n",
				"# Download and Install java\n",
				"####################################\n",
				"cd /tmp\n",
				"wget --no-cookies --no-check-certificate --header \"Cookie: gpw_e24=http%3A%2F%2Fwww.oracle.com%2F; oraclelicense=accept-securebackup-cookie\" \"http://download.oracle.com/otn-pub/java/jdk/8u131-b11/d54c1d3a095b4ff2b6607d096fa80163/jdk-8u131-linux-x64.rpm\"\n",
				"rpm -ivh jdk-8u131-linux-x64.rpm\n",

				"####################################\n",
				"# Install tomcat\n",
				"####################################\n",
				"groupadd tomcat\n",
				"useradd tomcat -b /app -g tomcat -e \"\"\n",
				"cd /tmp\n",
				"wget -O apache-tomcat-8.5.15.tar.gz http://archive.apache.org/dist/tomcat/tomcat-8/v8.5.15/bin/apache-tomcat-8.5.15.tar.gz\n",
				"tar xzf apache-tomcat-8.5.15.tar.gz\n",
				"mv apache-tomcat-8.5.15 /usr/local/tomcat8\n",

				"####################################\n",
				"# Add CORS\n",
				"####################################\n",
				"oldpattern=\"</web-app>\"\n",
				"newpattern=\"<filter> <filter-name>CorsFilter</filter-name>  <filter-class>org.apache.catalina.filters.CorsFilter</filter-class></filter><filter-mapping>  <filter-name>CorsFilter</filter-name>  <url-pattern>/*</url-pattern></filter-mapping>  </web-app>\"\n",
				"filename=\"/usr/local/tomcat8/conf/web.xml\"\n",
				"sed -i \"s@$oldpattern@$newpattern@g\" $filename\n",

				"# Set System Environment and Tomcat JVM Heap size\n",
				"#-----------------------------------\n",
				"sh -c \"echo 'export SERVER_ENVIRONMENT_VARIABLE=", { "Ref" : "EnvironmentShort" }, "'\" > /etc/profile.d/cpsync.sh\n",
				"sh -c \"echo 'export CATALINA_OPTS=\\\"-Xms2048M -Xmx2048M\\\"'\" >> /etc/profile.d/cpsync.sh\n",
				"sh -c \"echo 'SERVER_ENVIRONMENT_VARIABLE=", { "Ref" : "EnvironmentShort" }, "'\" > /etc/environment\n",
				"sh -c \"echo 'CATALINA_OPTS=\\\"-Xms2048M -Xmx2048M\\\"'\" >> /etc/environment\n",
				
				"# Set Tomcat Environment Variable\n",
				"#-----------------------------------\n",
				"# sh -c \"echo 'SERVER_ENVIRONMENT_VARIABLE=\"", { "Ref" : "EnvironmentShort" }, "\"'\" >> /usr/local/tomcat8/conf/tomcat.conf\n",

				"# Start Tomcat\n",
				"#-----------------------------------\n",
				"/usr/local/tomcat8/bin/startup.sh\n",

				"####################################\n",
				"# Create settings folder\n",
				"####################################\n",
				"mkdir /settings\n",
				"mkdir /settings/logs\n",
				"mkdir /settings/properties\n",
				"mkdir /settings/output\n",
				"chown svccp000 -R /settings\n",
				"chgrp -R -c cloudpricing /settings\n",
				"chmod -R -c 777 /settings\n",

				"####################################\n",
				"# Install Splunk Universal Forwarder\n",
				"####################################\n",
				"cd /tmp\n",
				"wget -O splunkforwarder-6.6.1-aeae3fe0c5af-linux-2.6-x86_64.rpm 'https://www.splunk.com/bin/splunk/DownloadActivityServlet?architecture=x86_64&platform=linux&version=6.6.1&product=universalforwarder&filename=splunkforwarder-6.6.1-aeae3fe0c5af-linux-2.6-x86_64.rpm&wget=true'\n",
				"chmod 744 splunkforwarder-6.6.1-aeae3fe0c5af-linux-2.6-x86_64.rpm\n",
				"rpm -i splunkforwarder-6.6.1-aeae3fe0c5af-linux-2.6-x86_64.rpm\n",
				"cd /opt/splunkforwarder\n",
				"./bin/splunk start --accept-license\n",
				"./bin/splunk enable boot-start\n",

				"# Configure to run as a deployment client\n",
				"#-----------------------------------\n",
				"./bin/splunk set deploy-poll splunkdeploy.na.sysco.net:8089 -auth admin:changeme\n",

				"# Configure forwarder to send logs to Splunk Indexer\n",
				"#-----------------------------------\n",
				"./bin/splunk add forward-server splunkindex.na.sysco.net:9997 -auth admin:changeme\n",
				"./bin/splunk restart\n",

				"####################################\n",
				"# Install CodeDeploy\n",
				"####################################\n",
				"yum install ruby -y\n",
				"wget https://aws-codedeploy-us-east-1.s3.amazonaws.com/latest/install\n",
				"chmod +x ./install\n",
				"./install auto\n",
				
				"date > /home/ec2-user/stoptime\n"
				]]}
			}
		}
	},
	"lx238cpsyncpmt01d" : {
		"Type" : "AWS::EC2::Instance",
		"Properties" : {
			"AvailabilityZone" : "us-east-1d",
			"ImageId" : {"Ref" : "AMIMCP"},
			"InstanceType" : "t2.medium",
			"KeyName" : { "Ref" : "PemKey2" },
			"SecurityGroupIds" : [{ "Ref" : "sgMCP" }, { "Ref" : "NATaccessSG" }, { "Ref" : "CheckMKSG" }],
			"IamInstanceProfile" : { "Ref" : "InstanceProfileMCP" },
			"SubnetId": { "Ref": "PvtSNd" },
			"BlockDeviceMappings" : [ {
				"DeviceName" : "/dev/sda1",
				"Ebs" : {
					"VolumeSize" : "60",
					"VolumeType" : "gp2"
				}
			} ],
			"Tags" : [
				{ "Key" : "Name", "Value" : "lx238cpsyncpmt01d" },
				{ "Key" : "Application_Name", "Value" : { "Ref" : "ApplicationName" } },
				{ "Key" : "Application_Id", "Value" : { "Ref" : "ApplicationId" } },
				{ "Key" : "Environment", "Value" : { "Ref" : "Environment" } },
				{ "Key" : "PO_Number", "Value" : { "Ref" : "PONumber" } },
				{ "Key" : "Project_ID", "Value" : { "Ref" : "ProjectId" } },
				{ "Key" : "Owner", "Value" : { "Ref" : "Owner" } },
				{ "Key" : "Approver", "Value" : { "Ref" : "Approver" } }
			],
			"UserData" : { "Fn::Base64" : { "Fn::Join" : ["", [
				"#!/bin/bash -v\n",
				"date > /home/ec2-user/starttime\n",
				"yum update -y aws-cfn-bootstrap\n",
				"yum update -y wget\n",
				"yum update -y curl\n",
				
				"# Set Timezone\n",
				"timedatectl set-timezone UTC\n",

				"# Install lsof locate and smbclient\n",
				"yum install -y sysstat lsof mlocate samba-client\n",

				"##############################################\n",
				"#Change hostname to include IP Address\n",
				"##############################################\n",
				"hostname lx238cpsyncpmt01d.na.sysco.net\n",
				"echo lx238cpsyncpmt01d.na.sysco.net > /etc/hostname","\n",
				"# sh -c \"hostname  cpsyncpmt-$(curl http://169.254.169.254/latest/meta-data/local-ipv4/ -s)d.na.sysco.net\"\n",
				"# sh -c \"echo  cpsyncpmt-$(curl http://169.254.169.254/latest/meta-data/local-ipv4/ -s)d.na.sysco.net\" > /etc/hostname\n",

				"#Add Users to server\n",
				"useradd -m -g aix -c \"James Owen, Cloud Enablement Team\" jowe6212\n",
				"useradd -m -g aix -c \"Mike Rowland, Enterprise Architect\" mrow7849\n",
				"useradd -m -g aix -c \"Fernando Nieto, App Dev\" fnie6886\n",

				"#Create Linux users and groups\n",
				"useradd svccp000 -p Cpaws000\n",
				"groupadd cloudpricing\n",
				"usermod svccp000 -a -G cloudpricing\n",
				"usermod svccp000 -a -G root\n",

				"####################################\n",
				"# Download and Install java\n",
				"####################################\n",
				"cd /tmp\n",
				"wget --no-cookies --no-check-certificate --header \"Cookie: gpw_e24=http%3A%2F%2Fwww.oracle.com%2F; oraclelicense=accept-securebackup-cookie\" \"http://download.oracle.com/otn-pub/java/jdk/8u131-b11/d54c1d3a095b4ff2b6607d096fa80163/jdk-8u131-linux-x64.rpm\"\n",
				"rpm -ivh jdk-8u131-linux-x64.rpm\n",

				"####################################\n",
				"# Install tomcat\n",
				"####################################\n",
				"groupadd tomcat\n",
				"useradd tomcat -b /app -g tomcat -e \"\"\n",
				"cd /tmp\n",
				"wget -O apache-tomcat-8.5.15.tar.gz http://archive.apache.org/dist/tomcat/tomcat-8/v8.5.15/bin/apache-tomcat-8.5.15.tar.gz\n",
				"tar xzf apache-tomcat-8.5.15.tar.gz\n",
				"mv apache-tomcat-8.5.15 /usr/local/tomcat8\n",

				"####################################\n",
				"# Add CORS\n",
				"####################################\n",
				"oldpattern=\"</web-app>\"\n",
				"newpattern=\"<filter> <filter-name>CorsFilter</filter-name>  <filter-class>org.apache.catalina.filters.CorsFilter</filter-class></filter><filter-mapping>  <filter-name>CorsFilter</filter-name>  <url-pattern>/*</url-pattern></filter-mapping>  </web-app>\"\n",
				"filename=\"/usr/local/tomcat8/conf/web.xml\"\n",
				"sed -i \"s@$oldpattern@$newpattern@g\" $filename\n",

				"# Set System Environment and Tomcat JVM Heap size\n",
				"#-----------------------------------\n",
				"sh -c \"echo 'export SERVER_ENVIRONMENT_VARIABLE=", { "Ref" : "EnvironmentShort" }, "'\" > /etc/profile.d/cpsync.sh\n",
				"sh -c \"echo 'export CATALINA_OPTS=\\\"-Xms2048M -Xmx2048M\\\"'\" >> /etc/profile.d/cpsync.sh\n",
				"sh -c \"echo 'SERVER_ENVIRONMENT_VARIABLE=", { "Ref" : "EnvironmentShort" }, "'\" > /etc/environment\n",
				"sh -c \"echo 'CATALINA_OPTS=\\\"-Xms2048M -Xmx2048M\\\"'\" >> /etc/environment\n",

				"# Set Tomcat Environment Variable\n",
				"#-----------------------------------\n",
				"# sh -c \"echo 'SERVER_ENVIRONMENT_VARIABLE=\"", { "Ref" : "EnvironmentShort" }, "\"'\" >> /usr/local/tomcat8/conf/tomcat.conf\n",

				"# Start Tomcat\n",
				"#-----------------------------------\n",
				"/usr/local/tomcat8/bin/startup.sh\n",

				"####################################\n",
				"# Create settings folder\n",
				"####################################\n",
				"mkdir /settings\n",
				"mkdir /settings/logs\n",
				"mkdir /settings/properties\n",
				"mkdir /settings/output\n",
				"chown svccp000 -R /settings\n",
				"chgrp -R -c cloudpricing /settings\n",
				"chmod -R -c 777 /settings\n",

				"####################################\n",
				"# Install Splunk Universal Forwarder\n",
				"####################################\n",
				"cd /tmp\n",
				"wget -O splunkforwarder-6.6.1-aeae3fe0c5af-linux-2.6-x86_64.rpm 'https://www.splunk.com/bin/splunk/DownloadActivityServlet?architecture=x86_64&platform=linux&version=6.6.1&product=universalforwarder&filename=splunkforwarder-6.6.1-aeae3fe0c5af-linux-2.6-x86_64.rpm&wget=true'\n",
				"chmod 744 splunkforwarder-6.6.1-aeae3fe0c5af-linux-2.6-x86_64.rpm\n",
				"rpm -i splunkforwarder-6.6.1-aeae3fe0c5af-linux-2.6-x86_64.rpm\n",
				"cd /opt/splunkforwarder\n",
				"./bin/splunk start --accept-license\n",
				"./bin/splunk enable boot-start\n",

				"# Configure to run as a deployment client\n",
				"#-----------------------------------\n",
				"./bin/splunk set deploy-poll splunkdeploy.na.sysco.net:8089 -auth admin:changeme\n",

				"# Configure forwarder to send logs to Splunk Indexer\n",
				"#-----------------------------------\n",
				"./bin/splunk add forward-server splunkindex.na.sysco.net:9997 -auth admin:changeme\n",
				"./bin/splunk restart\n",

				"####################################\n",
				"# Install CodeDeploy\n",
				"####################################\n",
				"yum install ruby -y\n",
				"wget https://aws-codedeploy-us-east-1.s3.amazonaws.com/latest/install\n",
				"chmod +x ./install\n",
				"./install auto\n",
				
				"date > /home/ec2-user/stoptime\n"
				]]}
			}
		}
	},
	"lx238cpsyncpmt02d" : {
		"Type" : "AWS::EC2::Instance",
		"Properties" : {
			"AvailabilityZone" : "us-east-1d",
			"ImageId" : {"Ref" : "AMIMCP"},
			"InstanceType" : "t2.medium",
			"KeyName" : { "Ref" : "PemKey2" },
			"SecurityGroupIds" : [{ "Ref" : "sgMCP" }, { "Ref" : "NATaccessSG" }, { "Ref" : "CheckMKSG" }],
			"IamInstanceProfile" : { "Ref" : "InstanceProfileMCP" },
			"SubnetId": { "Ref": "PvtSNd" },
			"BlockDeviceMappings" : [ {
				"DeviceName" : "/dev/sda1",
				"Ebs" : {
					"VolumeSize" : "60",
					"VolumeType" : "gp2"
				}
			} ],
			"Tags" : [
				{ "Key" : "Name", "Value" : "lx238cpsyncpmt02d" },
				{ "Key" : "Application_Name", "Value" : { "Ref" : "ApplicationName" } },
				{ "Key" : "Application_Id", "Value" : { "Ref" : "ApplicationId" } },
				{ "Key" : "Environment", "Value" : { "Ref" : "Environment" } },
				{ "Key" : "PO_Number", "Value" : { "Ref" : "PONumber" } },
				{ "Key" : "Project_ID", "Value" : { "Ref" : "ProjectId" } },
				{ "Key" : "Owner", "Value" : { "Ref" : "Owner" } },
				{ "Key" : "Approver", "Value" : { "Ref" : "Approver" } }
			],
			"UserData" : { "Fn::Base64" : { "Fn::Join" : ["", [
				"#!/bin/bash -v\n",
				"date > /home/ec2-user/starttime\n",
				"yum update -y aws-cfn-bootstrap\n",
				"yum update -y wget\n",
				"yum update -y curl\n",
				
				"# Set Timezone\n",
				"timedatectl set-timezone UTC\n",

				"# Install lsof locate and smbclient\n",
				"yum install -y sysstat lsof mlocate samba-client\n",

				"##############################################\n",
				"#Change hostname to include IP Address\n",
				"##############################################\n",
				"hostname lx238cpsyncpmt02d.na.sysco.net\n",
				"echo lx238cpsyncpmt02d.na.sysco.net > /etc/hostname","\n",
				"# sh -c \"hostname  cpsyncpmt-$(curl http://169.254.169.254/latest/meta-data/local-ipv4/ -s)d.na.sysco.net\"\n",
				"# sh -c \"echo  cpsyncpmt-$(curl http://169.254.169.254/latest/meta-data/local-ipv4/ -s)d.na.sysco.net\" > /etc/hostname\n",

				"#Add Users to server\n",
				"useradd -m -g aix -c \"James Owen, Cloud Enablement Team\" jowe6212\n",
				"useradd -m -g aix -c \"Mike Rowland, Enterprise Architect\" mrow7849\n",
				"useradd -m -g aix -c \"Fernando Nieto, App Dev\" fnie6886\n",

				"#Create Linux users and groups\n",
				"useradd svccp000 -p Cpaws000\n",
				"groupadd cloudpricing\n",
				"usermod svccp000 -a -G cloudpricing\n",
				"usermod svccp000 -a -G root\n",

				"####################################\n",
				"# Download and Install java\n",
				"####################################\n",
				"cd /tmp\n",
				"wget --no-cookies --no-check-certificate --header \"Cookie: gpw_e24=http%3A%2F%2Fwww.oracle.com%2F; oraclelicense=accept-securebackup-cookie\" \"http://download.oracle.com/otn-pub/java/jdk/8u131-b11/d54c1d3a095b4ff2b6607d096fa80163/jdk-8u131-linux-x64.rpm\"\n",
				"rpm -ivh jdk-8u131-linux-x64.rpm\n",

				"####################################\n",
				"# Install tomcat\n",
				"####################################\n",
				"groupadd tomcat\n",
				"useradd tomcat -b /app -g tomcat -e \"\"\n",
				"cd /tmp\n",
				"wget -O apache-tomcat-8.5.15.tar.gz http://archive.apache.org/dist/tomcat/tomcat-8/v8.5.15/bin/apache-tomcat-8.5.15.tar.gz\n",
				"tar xzf apache-tomcat-8.5.15.tar.gz\n",
				"mv apache-tomcat-8.5.15 /usr/local/tomcat8\n",

				"####################################\n",
				"# Add CORS\n",
				"####################################\n",
				"oldpattern=\"</web-app>\"\n",
				"newpattern=\"<filter> <filter-name>CorsFilter</filter-name>  <filter-class>org.apache.catalina.filters.CorsFilter</filter-class></filter><filter-mapping>  <filter-name>CorsFilter</filter-name>  <url-pattern>/*</url-pattern></filter-mapping>  </web-app>\"\n",
				"filename=\"/usr/local/tomcat8/conf/web.xml\"\n",
				"sed -i \"s@$oldpattern@$newpattern@g\" $filename\n",

				"# Set System Environment and Tomcat JVM Heap size\n",
				"#-----------------------------------\n",
				"sh -c \"echo 'export SERVER_ENVIRONMENT_VARIABLE=", { "Ref" : "EnvironmentShort" }, "'\" > /etc/profile.d/cpsync.sh\n",
				"sh -c \"echo 'export CATALINA_OPTS=\\\"-Xms2048M -Xmx2048M\\\"'\" >> /etc/profile.d/cpsync.sh\n",
				"sh -c \"echo 'SERVER_ENVIRONMENT_VARIABLE=", { "Ref" : "EnvironmentShort" }, "'\" > /etc/environment\n",
				"sh -c \"echo 'CATALINA_OPTS=\\\"-Xms2048M -Xmx2048M\\\"'\" >> /etc/environment\n",

				"# Set Tomcat Environment Variable\n",
				"#-----------------------------------\n",
				"# sh -c \"echo 'SERVER_ENVIRONMENT_VARIABLE=\"", { "Ref" : "EnvironmentShort" }, "\"'\" >> /usr/local/tomcat8/conf/tomcat.conf\n",

				"# Start Tomcat\n",
				"#-----------------------------------\n",
				"/usr/local/tomcat8/bin/startup.sh\n",

				"####################################\n",
				"# Create settings folder\n",
				"####################################\n",
				"mkdir /settings\n",
				"mkdir /settings/logs\n",
				"mkdir /settings/properties\n",
				"mkdir /settings/output\n",
				"chown svccp000 -R /settings\n",
				"chgrp -R -c cloudpricing /settings\n",
				"chmod -R -c 777 /settings\n",

				"####################################\n",
				"# Install Splunk Universal Forwarder\n",
				"####################################\n",
				"cd /tmp\n",
				"wget -O splunkforwarder-6.6.1-aeae3fe0c5af-linux-2.6-x86_64.rpm 'https://www.splunk.com/bin/splunk/DownloadActivityServlet?architecture=x86_64&platform=linux&version=6.6.1&product=universalforwarder&filename=splunkforwarder-6.6.1-aeae3fe0c5af-linux-2.6-x86_64.rpm&wget=true'\n",
				"chmod 744 splunkforwarder-6.6.1-aeae3fe0c5af-linux-2.6-x86_64.rpm\n",
				"rpm -i splunkforwarder-6.6.1-aeae3fe0c5af-linux-2.6-x86_64.rpm\n",
				"cd /opt/splunkforwarder\n",
				"./bin/splunk start --accept-license\n",
				"./bin/splunk enable boot-start\n",

				"# Configure to run as a deployment client\n",
				"#-----------------------------------\n",
				"./bin/splunk set deploy-poll splunkdeploy.na.sysco.net:8089 -auth admin:changeme\n",

				"# Configure forwarder to send logs to Splunk Indexer\n",
				"#-----------------------------------\n",
				"./bin/splunk add forward-server splunkindex.na.sysco.net:9997 -auth admin:changeme\n",
				"./bin/splunk restart\n",

				"####################################\n",
				"# Install CodeDeploy\n",
				"####################################\n",
				"yum install ruby -y\n",
				"wget https://aws-codedeploy-us-east-1.s3.amazonaws.com/latest/install\n",
				"chmod +x ./install\n",
				"./install auto\n",
				
				"date > /home/ec2-user/stoptime\n"
				]]}
			}
		}
	},
	"lx238cpsyncagm01d" : {
		"Type" : "AWS::EC2::Instance",
		"Properties" : {
			"AvailabilityZone" : "us-east-1d",
			"ImageId" : {"Ref" : "AMIMCP"},
			"InstanceType" : "t2.medium",
			"KeyName" : { "Ref" : "PemKey2" },
			"SecurityGroupIds" : [{ "Ref" : "sgMCP" }, { "Ref" : "NATaccessSG" }, { "Ref" : "CheckMKSG" }],
			"IamInstanceProfile" : { "Ref" : "InstanceProfileMCP" },
			"SubnetId": { "Ref": "PvtSNd" },
			"BlockDeviceMappings" : [ {
				"DeviceName" : "/dev/sda1",
				"Ebs" : {
					"VolumeSize" : "60",
					"VolumeType" : "gp2"
				}
			} ],
			"Tags" : [
				{ "Key" : "Name", "Value" : "lx238cpsyncagm01d" },
				{ "Key" : "Application_Name", "Value" : { "Ref" : "ApplicationName" } },
				{ "Key" : "Application_Id", "Value" : { "Ref" : "ApplicationId" } },
				{ "Key" : "Environment", "Value" : { "Ref" : "Environment" } },
				{ "Key" : "PO_Number", "Value" : { "Ref" : "PONumber" } },
				{ "Key" : "Project_ID", "Value" : { "Ref" : "ProjectId" } },
				{ "Key" : "Owner", "Value" : { "Ref" : "Owner" } },
				{ "Key" : "Approver", "Value" : { "Ref" : "Approver" } }
			],
			"UserData" : { "Fn::Base64" : { "Fn::Join" : ["", [
				"#!/bin/bash -v\n",
				"date > /home/ec2-user/starttime\n",
				"yum update -y aws-cfn-bootstrap\n",
				"yum update -y wget\n",
				"yum update -y curl\n",
				
				"# Set Timezone\n",
				"timedatectl set-timezone UTC\n",

				"# Install lsof locate and smbclient\n",
				"yum install -y sysstat lsof mlocate samba-client\n",

				"##############################################\n",
				"#Change hostname to include IP Address\n",
				"##############################################\n",
				"hostname lx238cpsyncagm01d.na.sysco.net\n",
				"echo lx238cpsyncagm01d.na.sysco.net > /etc/hostname","\n",
				"# sh -c \"hostname  cpsyncagm-$(curl http://169.254.169.254/latest/meta-data/local-ipv4/ -s)d.na.sysco.net\"\n",
				"# sh -c \"echo  cpsyncamt-$(curl http://169.254.169.254/latest/meta-data/local-ipv4/ -s)d.na.sysco.net\" > /etc/hostname\n",

				"#Add Users to server\n",
				"useradd -m -g aix -c \"James Owen, Cloud Enablement Team\" jowe6212\n",
				"useradd -m -g aix -c \"Mike Rowland, Enterprise Architect\" mrow7849\n",
				"useradd -m -g aix -c \"Fernando Nieto, App Dev\" fnie6886\n",

				"#Create Linux users and groups\n",
				"useradd svccp000 -p Cpaws000\n",
				"groupadd cloudpricing\n",
				"usermod svccp000 -a -G cloudpricing\n",
				"usermod svccp000 -a -G root\n",

				"####################################\n",
				"# Download and Install java\n",
				"####################################\n",
				"cd /tmp\n",
				"wget --no-cookies --no-check-certificate --header \"Cookie: gpw_e24=http%3A%2F%2Fwww.oracle.com%2F; oraclelicense=accept-securebackup-cookie\" \"http://download.oracle.com/otn-pub/java/jdk/8u131-b11/d54c1d3a095b4ff2b6607d096fa80163/jdk-8u131-linux-x64.rpm\"\n",
				"rpm -ivh jdk-8u131-linux-x64.rpm\n",

				"####################################\n",
				"# Install tomcat\n",
				"####################################\n",
				"groupadd tomcat\n",
				"useradd tomcat -b /app -g tomcat -e \"\"\n",
				"cd /tmp\n",
				"wget -O apache-tomcat-8.5.15.tar.gz http://archive.apache.org/dist/tomcat/tomcat-8/v8.5.15/bin/apache-tomcat-8.5.15.tar.gz\n",
				"tar xzf apache-tomcat-8.5.15.tar.gz\n",
				"mv apache-tomcat-8.5.15 /usr/local/tomcat8\n",

				"####################################\n",
				"# Add CORS\n",
				"####################################\n",
				"oldpattern=\"</web-app>\"\n",
				"newpattern=\"<filter> <filter-name>CorsFilter</filter-name>  <filter-class>org.apache.catalina.filters.CorsFilter</filter-class></filter><filter-mapping>  <filter-name>CorsFilter</filter-name>  <url-pattern>/*</url-pattern></filter-mapping>  </web-app>\"\n",
				"filename=\"/usr/local/tomcat8/conf/web.xml\"\n",
				"sed -i \"s@$oldpattern@$newpattern@g\" $filename\n",

				"# Set System Environment and Tomcat JVM Heap size\n",
				"#-----------------------------------\n",
				"sh -c \"echo 'export SERVER_ENVIRONMENT_VARIABLE=", { "Ref" : "EnvironmentShort" }, "'\" > /etc/profile.d/cpsync.sh\n",
				"sh -c \"echo 'export CATALINA_OPTS=\\\"-Xms2048M -Xmx2048M\\\"'\" >> /etc/profile.d/cpsync.sh\n",
				"sh -c \"echo 'SERVER_ENVIRONMENT_VARIABLE=", { "Ref" : "EnvironmentShort" }, "'\" > /etc/environment\n",
				"sh -c \"echo 'CATALINA_OPTS=\\\"-Xms2048M -Xmx2048M\\\"'\" >> /etc/environment\n",

				"# Set Tomcat Environment Variable\n",
				"#-----------------------------------\n",
				"# sh -c \"echo 'SERVER_ENVIRONMENT_VARIABLE=\"", { "Ref" : "EnvironmentShort" }, "\"'\" >> /usr/local/tomcat8/conf/tomcat.conf\n",

				"# Start Tomcat\n",
				"#-----------------------------------\n",
				"/usr/local/tomcat8/bin/startup.sh\n",

				"####################################\n",
				"# Create settings folder\n",
				"####################################\n",
				"mkdir /settings\n",
				"mkdir /settings/logs\n",
				"mkdir /settings/properties\n",
				"mkdir /settings/output\n",
				"chown svccp000 -R /settings\n",
				"chgrp -R -c cloudpricing /settings\n",
				"chmod -R -c 777 /settings\n",

				"####################################\n",
				"# Install Splunk Universal Forwarder\n",
				"####################################\n",
				"cd /tmp\n",
				"wget -O splunkforwarder-6.6.1-aeae3fe0c5af-linux-2.6-x86_64.rpm 'https://www.splunk.com/bin/splunk/DownloadActivityServlet?architecture=x86_64&platform=linux&version=6.6.1&product=universalforwarder&filename=splunkforwarder-6.6.1-aeae3fe0c5af-linux-2.6-x86_64.rpm&wget=true'\n",
				"chmod 744 splunkforwarder-6.6.1-aeae3fe0c5af-linux-2.6-x86_64.rpm\n",
				"rpm -i splunkforwarder-6.6.1-aeae3fe0c5af-linux-2.6-x86_64.rpm\n",
				"cd /opt/splunkforwarder\n",
				"./bin/splunk start --accept-license\n",
				"./bin/splunk enable boot-start\n",

				"# Configure to run as a deployment client\n",
				"#-----------------------------------\n",
				"./bin/splunk set deploy-poll splunkdeploy.na.sysco.net:8089 -auth admin:changeme\n",

				"# Configure forwarder to send logs to Splunk Indexer\n",
				"#-----------------------------------\n",
				"./bin/splunk add forward-server splunkindex.na.sysco.net:9997 -auth admin:changeme\n",
				"./bin/splunk restart\n",

				"####################################\n",
				"# Install CodeDeploy\n",
				"####################################\n",
				"yum install ruby -y\n",
				"wget https://aws-codedeploy-us-east-1.s3.amazonaws.com/latest/install\n",
				"chmod +x ./install\n",
				"./install auto\n",
				
				"date > /home/ec2-user/stoptime\n"
				]]}
			}
		}
	},
	"lx238cpsynccost01d" : {
		"Type" : "AWS::EC2::Instance",
		"Properties" : {
			"AvailabilityZone" : "us-east-1d",
			"ImageId" : {"Ref" : "AMIMCP"},
			"InstanceType" : "t2.medium",
			"KeyName" : { "Ref" : "PemKey2" },
			"SecurityGroupIds" : [{ "Ref" : "sgMCP" }, { "Ref" : "NATaccessSG" }, { "Ref" : "CheckMKSG" }],
			"IamInstanceProfile" : { "Ref" : "InstanceProfileMCP" },
			"SubnetId": { "Ref": "PvtSNd" },
			"BlockDeviceMappings" : [ {
				"DeviceName" : "/dev/sda1",
				"Ebs" : {
					"VolumeSize" : "60",
					"VolumeType" : "gp2"
				}
			} ],
			"Tags" : [
				{ "Key" : "Name", "Value" : "lx238cpsynccost01d" },
				{ "Key" : "Application_Name", "Value" : { "Ref" : "ApplicationName" } },
				{ "Key" : "Application_Id", "Value" : { "Ref" : "ApplicationId" } },
				{ "Key" : "Environment", "Value" : { "Ref" : "Environment" } },
				{ "Key" : "PO_Number", "Value" : { "Ref" : "PONumber" } },
				{ "Key" : "Project_ID", "Value" : { "Ref" : "ProjectId" } },
				{ "Key" : "Owner", "Value" : { "Ref" : "Owner" } },
				{ "Key" : "Approver", "Value" : { "Ref" : "Approver" } }
			],
			"UserData" : { "Fn::Base64" : { "Fn::Join" : ["", [
				"#!/bin/bash -v\n",
				"date > /home/ec2-user/starttime\n",
				"yum update -y aws-cfn-bootstrap\n",
				"yum update -y wget\n",
				"yum update -y curl\n",
				
				"# Set Timezone\n",
				"timedatectl set-timezone UTC\n",

				"# Install lsof locate and smbclient\n",
				"yum install -y sysstat lsof mlocate samba-client\n",

				"##############################################\n",
				"#Change hostname to include IP Address\n",
				"##############################################\n",
				"hostname lx238cpsynccost01d.na.sysco.net\n",
				"echo lx238cpsynccost01d.na.sysco.net > /etc/hostname","\n",
				"# sh -c \"hostname  cpsynccost-$(curl http://169.254.169.254/latest/meta-data/local-ipv4/ -s)d.na.sysco.net\"\n",
				"# sh -c \"echo  cpsynccost-$(curl http://169.254.169.254/latest/meta-data/local-ipv4/ -s)d.na.sysco.net\" > /etc/hostname\n",

				"#Add Users to server\n",
				"useradd -m -g aix -c \"James Owen, Cloud Enablement Team\" jowe6212\n",
				"useradd -m -g aix -c \"Mike Rowland, Enterprise Architect\" mrow7849\n",
				"useradd -m -g aix -c \"Fernando Nieto, App Dev\" fnie6886\n",

				"#Create Linux users and groups\n",
				"useradd svccp000 -p Cpaws000\n",
				"groupadd cloudpricing\n",
				"usermod svccp000 -a -G cloudpricing\n",
				"usermod svccp000 -a -G root\n",

				"####################################\n",
				"# Download and Install java\n",
				"####################################\n",
				"cd /tmp\n",
				"wget --no-cookies --no-check-certificate --header \"Cookie: gpw_e24=http%3A%2F%2Fwww.oracle.com%2F; oraclelicense=accept-securebackup-cookie\" \"http://download.oracle.com/otn-pub/java/jdk/8u131-b11/d54c1d3a095b4ff2b6607d096fa80163/jdk-8u131-linux-x64.rpm\"\n",
				"rpm -ivh jdk-8u131-linux-x64.rpm\n",

				"####################################\n",
				"# Install tomcat\n",
				"####################################\n",
				"groupadd tomcat\n",
				"useradd tomcat -b /app -g tomcat -e \"\"\n",
				"cd /tmp\n",
				"wget -O apache-tomcat-8.5.15.tar.gz http://archive.apache.org/dist/tomcat/tomcat-8/v8.5.15/bin/apache-tomcat-8.5.15.tar.gz\n",
				"tar xzf apache-tomcat-8.5.15.tar.gz\n",
				"mv apache-tomcat-8.5.15 /usr/local/tomcat8\n",

				"####################################\n",
				"# Add CORS\n",
				"####################################\n",
				"oldpattern=\"</web-app>\"\n",
				"newpattern=\"<filter> <filter-name>CorsFilter</filter-name>  <filter-class>org.apache.catalina.filters.CorsFilter</filter-class></filter><filter-mapping>  <filter-name>CorsFilter</filter-name>  <url-pattern>/*</url-pattern></filter-mapping>  </web-app>\"\n",
				"filename=\"/usr/local/tomcat8/conf/web.xml\"\n",
				"sed -i \"s@$oldpattern@$newpattern@g\" $filename\n",

				"# Set System Environment and Tomcat JVM Heap size\n",
				"#-----------------------------------\n",
				"sh -c \"echo 'export SERVER_ENVIRONMENT_VARIABLE=", { "Ref" : "EnvironmentShort" }, "'\" > /etc/profile.d/cpsync.sh\n",
				"sh -c \"echo 'export CATALINA_OPTS=\\\"-Xms2048M -Xmx2048M\\\"'\" >> /etc/profile.d/cpsync.sh\n",
				"sh -c \"echo 'SERVER_ENVIRONMENT_VARIABLE=", { "Ref" : "EnvironmentShort" }, "'\" > /etc/environment\n",
				"sh -c \"echo 'CATALINA_OPTS=\\\"-Xms2048M -Xmx2048M\\\"'\" >> /etc/environment\n",

				"# Set Tomcat Environment Variable\n",
				"#-----------------------------------\n",
				"# sh -c \"echo 'SERVER_ENVIRONMENT_VARIABLE=\"", { "Ref" : "EnvironmentShort" }, "\"'\" >> /usr/local/tomcat8/conf/tomcat.conf\n",

				"# Start Tomcat\n",
				"#-----------------------------------\n",
				"/usr/local/tomcat8/bin/startup.sh\n",

				"####################################\n",
				"# Create settings folder\n",
				"####################################\n",
				"mkdir /settings\n",
				"mkdir /settings/logs\n",
				"mkdir /settings/properties\n",
				"mkdir /settings/output\n",
				"chown svccp000 -R /settings\n",
				"chgrp -R -c cloudpricing /settings\n",
				"chmod -R -c 777 /settings\n",

				"####################################\n",
				"# Install Splunk Universal Forwarder\n",
				"####################################\n",
				"cd /tmp\n",
				"wget -O splunkforwarder-6.6.2-4b804538c686-linux-2.6-x86_64.rpm 'https://www.splunk.com/bin/splunk/DownloadActivityServlet?architecture=x86_64&platform=linux&version=6.6.2&product=universalforwarder&filename=splunkforwarder-6.6.2-4b804538c686-linux-2.6-x86_64.rpm&wget=true'\n",
				"chmod 744 splunkforwarder-6.6.2-4b804538c686-linux-2.6-x86_64.rpm\n",
				"rpm -i splunkforwarder-6.6.2-4b804538c686-linux-2.6-x86_64.rpm\n",
				"cd /opt/splunkforwarder\n",
				"./bin/splunk start --accept-license\n",
				"./bin/splunk enable boot-start\n",

				"# Configure to run as a deployment client\n",
				"#-----------------------------------\n",
				"./bin/splunk set deploy-poll splunkdeploy.na.sysco.net:8089 -auth admin:changeme\n",

				"# Configure forwarder to send logs to Splunk Indexer\n",
				"#-----------------------------------\n",
				"./bin/splunk add forward-server splunkindex.na.sysco.net:9997 -auth admin:changeme\n",
				"./bin/splunk restart\n",

				"####################################\n",
				"# Install CodeDeploy\n",
				"####################################\n",
				"yum install ruby -y\n",
				"wget https://aws-codedeploy-us-east-1.s3.amazonaws.com/latest/install\n",
				"chmod +x ./install\n",
				"./install auto\n",
				
				"date > /home/ec2-user/stoptime\n"
				]]}
			}
		}
	},
	"JobProcessorGroup" : {
		"Type" : "AWS::AutoScaling::AutoScalingGroup",
		"Properties" : {
			"AvailabilityZones" : ["us-east-1d"],
			"LaunchConfigurationName" : { "Ref" : "JobProcessorLaunchConfig" },
			"MinSize" : "1",
			"MaxSize" : "2",
			"DesiredCapacity" : "1",
			"HealthCheckType": "EC2",
			"HealthCheckGracePeriod": "300",
			"VPCZoneIdentifier" : [ { "Ref" : "PvtSNd" } ],
			"Tags" : [
				{ "Key" : "Name", "Value" : "lx238cpjp01d", "PropagateAtLaunch" : "true" },
				{ "Key" : "Application_Name", "Value" : { "Ref" : "ApplicationName" }, "PropagateAtLaunch" : "true" },
				{ "Key" : "Application_Id", "Value" : { "Ref" : "ApplicationId" }, "PropagateAtLaunch" : "true" },
				{ "Key" : "Environment", "Value" : { "Ref" : "Environment" }, "PropagateAtLaunch" : "true" },
				{ "Key" : "PO_Number", "Value" : { "Ref" : "PONumber" }, "PropagateAtLaunch" : "true" },
				{ "Key" : "Project_ID", "Value" : { "Ref" : "ProjectId" }, "PropagateAtLaunch" : "true" },
				{ "Key" : "Owner", "Value" : { "Ref" : "Owner" }, "PropagateAtLaunch" : "true" },
				{ "Key" : "Approver", "Value" : { "Ref" : "Approver" }, "PropagateAtLaunch" : "true" }
			]
		},
		"UpdatePolicy" : {
			"AutoScalingScheduledAction" : {
				"IgnoreUnmodifiedGroupSizeProperties" : "true"
			},
			"AutoScalingRollingUpdate" : {
				"MinInstancesInService" : "1",
				"MaxBatchSize" : "1",
				"PauseTime" : "PT5M",
				"WaitOnResourceSignals" : "false"
			}
		}
	},
	"JobProcessorLaunchConfig" : {
		"Type" : "AWS::AutoScaling::LaunchConfiguration",
		"Properties" : {
			"ImageId" : {"Ref" : "AMIMCP"},
			"InstanceType" : "t2.medium",
			"KeyName" : { "Ref" : "PemKey2" },
			"SecurityGroups" : [{ "Ref" : "sgMCP" }, { "Ref" : "NATaccessSG" }, { "Ref" : "CheckMKSG" }],
			"IamInstanceProfile" : { "Ref" : "InstanceProfileMCP" },
			"BlockDeviceMappings" : [ {
				"DeviceName" : "/dev/sda1",
				"Ebs" : {
					"VolumeSize" : "60",
					"VolumeType" : "gp2"
				}
			} ],
			"UserData" : { "Fn::Base64" : { "Fn::Join" : ["", [
				"#!/bin/bash -v\n",
				"date > /home/ec2-user/starttime\n",
				"yum update -y aws-cfn-bootstrap\n",
				"yum update -y wget\n",
				"yum update -y curl\n",
				
				"# Set Timezone\n",
				"timedatectl set-timezone UTC\n",

				"# Install lsof locate and smbclient\n",
				"yum install -y sysstat lsof mlocate samba-client\n",

				"#Change Name of server to match new hostname\n",
				"hostname lx238cpjp01d.na.sysco.net\n",
				"echo lx238cpjp01d.na.sysco.net > /etc/hostname","\n",
				"# sh -c \"hostname  cpjp-$(curl http://169.254.169.254/latest/meta-data/local-ipv4/ -s)d.na.sysco.net\"\n",
				"#sh -c \"echo  cpjp-$(curl http://169.254.169.254/latest/meta-data/local-ipv4/ -s)d.na.sysco.net\" > /etc/hostname\n",

				"####################################\n",
				"#Add Users to server\n",
				"####################################\n",
				"useradd -m -g aix -c \"James Owen, Cloud Enablement Team\" jowe6212\n",
				"useradd -m -g aix -c \"Mike Rowland, Enterprise Architect\" mrow7849\n",
				"useradd -m -g aix -c \"Fernando Nieto, App Dev\" fnie6886\n",
				"useradd -m -g aix -c \"Ravi Goli, App Dev\" rgol4427\n",

				"#Create Linux users and groups\n",
				"useradd svccp000 -p Cpaws000\n",
				"groupadd cloudpricing\n",
				"usermod svccp000 -a -G cloudpricing\n",
				"usermod svccp000 -a -G root\n",

				"####################################\n",
				"# Download and Install java\n",
				"####################################\n",
				"cd /tmp\n",
				"wget --no-cookies --no-check-certificate --header \"Cookie: gpw_e24=http%3A%2F%2Fwww.oracle.com%2F; oraclelicense=accept-securebackup-cookie\" \"http://download.oracle.com/otn-pub/java/jdk/8u131-b11/d54c1d3a095b4ff2b6607d096fa80163/jdk-8u131-linux-x64.rpm\"\n",
				"rpm -ivh jdk-8u131-linux-x64.rpm\n",

				"# Set Server Environment\n",
				"sh -c \"echo 'export SERVER_ENVIRONMENT_VARIABLE=", { "Ref" : "EnvironmentShort" }, "'\" > /etc/profile.d/cpmcp.sh\n",
				"# sh -c \"echo 'export SERVER_ENVIRONMENT=DEV' >> /etc/profile.d/cpmcp.sh\"\n",
				"sh -c \"echo 'SERVER_ENVIRONMENT_VARIABLE=", { "Ref" : "EnvironmentShort" }, "'\" > /etc/environment\n",
				"# sh -c \"echo 'SERVER_ENVIRONMENT=DEV' >> /etc/environment\"\n",
				
				"# Create settings folder\n",
				"mkdir /settings\n",
				"mkdir /settings/properties\n",
				"mkdir /settings/logs\n",
				"mkdir /opt/cloudpricing\n",
				"chown svccp000 -R /settings\n",
				"chown svccp000 -R /opt/cloudpricing\n",
				"chgrp -R -c cloudpricing /settings\n",
				"chgrp -R -c cloudpricing /opt/cloudpricing\n",
				"chmod -R -c 777 /settings\n",
				"chmod -R -c 777 /opt/cloudpricing\n",

				"####################################\n",
				"# Install Splunk Universal Forwarder\n",
				"####################################\n",
				"cd /tmp\n",
				"wget -O splunkforwarder-6.6.1-aeae3fe0c5af-linux-2.6-x86_64.rpm 'https://www.splunk.com/bin/splunk/DownloadActivityServlet?architecture=x86_64&platform=linux&version=6.6.1&product=universalforwarder&filename=splunkforwarder-6.6.1-aeae3fe0c5af-linux-2.6-x86_64.rpm&wget=true'\n",
				"chmod 744 splunkforwarder-6.6.1-aeae3fe0c5af-linux-2.6-x86_64.rpm\n",
				"rpm -i splunkforwarder-6.6.1-aeae3fe0c5af-linux-2.6-x86_64.rpm\n",
				"cd /opt/splunkforwarder\n",
				"./bin/splunk start --accept-license\n",
				"./bin/splunk enable boot-start\n",

				"# Configure to run as a deployment client\n",
				"#-----------------------------------\n",
				"./bin/splunk set deploy-poll splunkdeploy.na.sysco.net:8089 -auth admin:changeme\n",

				"# Configure forwarder to send logs to Splunk Indexer\n",
				"#-----------------------------------\n",
				"./bin/splunk add forward-server splunkindex.na.sysco.net:9997 -auth admin:changeme\n",
				"./bin/splunk restart\n",

				"####################################\n",
				"# Install CodeDeploy\n",
				"####################################\n",
				"yum install ruby -y\n",
				"wget https://aws-codedeploy-us-east-1.s3.amazonaws.com/latest/install\n",
				"chmod +x ./install\n",
				"./install auto\n",
				
				"date > /home/ec2-user/stoptime\n"
				]]}
			}
		}
	},
	"sgMCP" : {
		"Type" : "AWS::EC2::SecurityGroup",
		"Properties" : {
			"GroupDescription" : "CP MCP App SG",
			"VpcId" : { "Ref" : "VPCID" },
			"SecurityGroupIngress" : [ 
			{
				"IpProtocol" : "tcp",
				"FromPort" : "80",
				"ToPort" : "80",
				"CidrIp" : "10.0.0.0/8"
			},
			{
				"IpProtocol" : "tcp",
				"FromPort" : "80",
				"ToPort" : "8080",
				"CidrIp" : "10.0.0.0/8"
			},
			{
				"IpProtocol" : "tcp",
				"FromPort" : "22",
				"ToPort" : "22",
				"CidrIp" : "10.0.0.0/8"
			},
			{
				"IpProtocol" : "icmp",
				"FromPort" : "-1",
				"ToPort" : "-1",
				"CidrIp" : "10.0.0.0/8"
			}
			],
			"Tags" : [
				{ "Key" : "Name", "Value" : "sg/vpc_sysco_dev_01/cpmcp_dev_app" },
				{ "Key" : "Application_Name", "Value" : { "Ref" : "ApplicationName" } },
				{ "Key" : "Application_Id", "Value" : { "Ref" : "ApplicationId" } },
				{ "Key" : "Environment", "Value" : { "Ref" : "Environment" } },
				{ "Key" : "Cost_Center", "Value" : { "Ref" : "PONumber" } },
				{ "Key" : "PO_Number", "Value" : { "Ref" : "PONumber" } },
				{ "Key" : "Project_ID", "Value" : { "Ref" : "ProjectId" } },
				{ "Key" : "Owner", "Value" : { "Ref" : "Owner" } },
				{ "Key" : "Approver", "Value" : { "Ref" : "Approver" } }
			]
		}
	},
	"CPDBClusterDEV" : {
		"Type" : "AWS::RDS::DBCluster",
		"DeletionPolicy" : "Snapshot",
		"Properties" : {
			"DatabaseName" : "CPDB_Common01d",
			"Engine" : "aurora",
			"MasterUsername" : "svccp000",
			"MasterUserPassword" : "Cpaws000",
			"Port" : "3306",
			"VpcSecurityGroupIds" : [ { "Ref" : "sgDB" }],
			"DBSubnetGroupName" : { "Ref" : "snDB" }
		}
	},
	"DBCommonPrimary" : {
		"Type" : "AWS::RDS::DBInstance",
		"Properties" :  {
			"DBInstanceIdentifier" : "CPDBMasterDEV",
			"AllowMajorVersionUpgrade" : "true",
			"DBClusterIdentifier" : { "Ref" : "CPDBClusterDEV" },
			"DBInstanceClass" : "db.r3.large",
			"Engine" : "aurora",
			"DBSubnetGroupName" : { "Ref" : "snDB" },
			"Tags" : [
				{ "Key" : "Name", "Value" : "Cloud Pricing Common Database Primary" },
				{ "Key" : "Application_Name", "Value" : { "Ref" : "ApplicationName" } },
				{ "Key" : "Application_Id", "Value" : { "Ref" : "ApplicationId" } },
				{ "Key" : "Environment", "Value" : { "Ref" : "Environment" } },
				{ "Key" : "PO_Number", "Value" : { "Ref" : "PONumber" } },
				{ "Key" : "Project_ID", "Value" : { "Ref" : "ProjectId" } },
				{ "Key" : "Owner", "Value" : { "Ref" : "Owner" } },
				{ "Key" : "Approver", "Value" : { "Ref" : "Approver" } }
			]
		}
	},
	"sgDB" : {
		"Type" : "AWS::EC2::SecurityGroup",
		"Properties" : {
			"GroupDescription" : "Cloud Pricing DB SG",
			"VpcId" : { "Ref" : "VPCID" },
			"SecurityGroupIngress" : [
			{
				"IpProtocol" : "tcp",
				"FromPort" : "3306",
				"ToPort" : "3306",
				"CidrIp" : "10.0.0.0/8"
			}],
			"Tags" : [
				{ "Key" : "Name", "Value" : "sg/vpc_sysco_dev_01/swmsmobile_dev_db" },
				{ "Key" : "Application_Name", "Value" : { "Ref" : "ApplicationName" } },
				{ "Key" : "Application_Id", "Value" : { "Ref" : "ApplicationId" } },
				{ "Key" : "Environment", "Value" : { "Ref" : "Environment" } },
				{ "Key" : "PO_Number", "Value" : { "Ref" : "PONumber" } },
				{ "Key" : "Project_ID", "Value" : { "Ref" : "ProjectId" } },
				{ "Key" : "Owner", "Value" : { "Ref" : "Owner" } },
				{ "Key" : "Approver", "Value" : { "Ref" : "Approver" } }
			]
		}
	},
	"snDB" : {
		"Type" : "AWS::RDS::DBSubnetGroup",
		"Properties" : {
			"DBSubnetGroupDescription" : "Subnets available for the RDS DB Instance",
			"SubnetIds" : [ {"Ref" : "PvtSNc"},{"Ref" : "PvtSNd"} ],
			"Tags" : [
				{ "Key" : "Name", "Value" : "Cloud Pricing DB Subnet group" },
				{ "Key" : "Application_Name", "Value" : { "Ref" : "ApplicationName" } },
				{ "Key" : "Application_Id", "Value" : { "Ref" : "ApplicationId" } },
				{ "Key" : "Environment", "Value" : { "Ref" : "Environment" } },
				{ "Key" : "PO_Number", "Value" : { "Ref" : "PONumber" } },
				{ "Key" : "Project_ID", "Value" : { "Ref" : "ProjectId" } },
				{ "Key" : "Owner", "Value" : { "Ref" : "Owner" } },
				{ "Key" : "Approver", "Value" : { "Ref" : "Approver" } }
			]
		}
	},
    "MS238CPBTSQL08d": {
      "Type": "AWS::EC2::Instance",
      "Properties": {
        "AvailabilityZone": "us-east-1c",
        "DisableApiTermination": "false",
        "ImageId": { "Ref": "ODAMI" },
        "InstanceType": "m3.large",
        "KeyName": { "Ref": "PemKey" },
        "SecurityGroupIds": [
          { "Ref": "DevDBSG" },
          { "Ref": "NATaccessSG" },
          { "Ref": "CheckMKSG" }
        ],
        "SubnetId": { "Ref": "PvtSNc" },
        "Tags": [
			{ "Key" : "Name", "Value" : "ms238cpbtsql08d" },
			{ "Key" : "Application_Id", "Value" : { "Ref" : "ApplicationId" } },
			{ "Key" : "Application_Name", "Value" : { "Ref" : "ApplicationName" } },
			{ "Key" : "Environment", "Value" : { "Ref" : "Environment" } },
			{ "Key" : "PO_Number", "Value" : { "Ref" : "PONumber" } },
			{ "Key" : "Project_ID", "Value" : { "Ref" : "ProjectId" } },
			{ "Key" : "Owner", "Value" : { "Ref" : "Owner" } },
			{ "Key" : "Approver", "Value" : { "Ref" : "Approver" } }
        ],
        "UserData": {
          "Fn::Base64": {
            "Fn::Join": [
              "",
              [
                "<powershell>\n",
                "Rename-Computer -NewName ms238cpbtsql08d -Restart\n",
                "</powershell>"
              ]
            ]
          }
        }
      }
    },
    "MS238CPODSQL08d": {
      "Type": "AWS::EC2::Instance",
      "Properties": {
        "AvailabilityZone": "us-east-1c",
        "DisableApiTermination": "false",
        "ImageId": { "Ref": "ODAMI" },
        "InstanceType": "m3.large",
        "KeyName": { "Ref": "PemKey" },
        "SecurityGroupIds": [
          { "Ref": "DevDBSG" },
          { "Ref": "NATaccessSG" },
          { "Ref": "CheckMKSG" }
        ],
        "SubnetId": { "Ref": "PvtSNc" },
        "Tags": [
			{ "Key" : "Name", "Value" : "ms238cpodsql08d" },
			{ "Key" : "Application_Id", "Value" : { "Ref" : "ApplicationId" } },
			{ "Key" : "Application_Name", "Value" : { "Ref" : "ApplicationName" } },
			{ "Key" : "Environment", "Value" : { "Ref" : "Environment" } },
			{ "Key" : "PO_Number", "Value" : { "Ref" : "PONumber" } },
			{ "Key" : "Project_ID", "Value" : { "Ref" : "ProjectId" } },
			{ "Key" : "Owner", "Value" : { "Ref" : "Owner" } },
			{ "Key" : "Approver", "Value" : { "Ref" : "Approver" } }
        ],
        "UserData": {
          "Fn::Base64": {
            "Fn::Join": [
              "",
              [
                "<powershell>\n",
                "Rename-Computer -NewName ms238cpodsql08d -Restart\n",
                "</powershell>"
              ]
            ]
          }
        }
      }
    },
    "MS238CPODSQL09d": {
      "Type": "AWS::EC2::Instance",
      "Properties": {
        "AvailabilityZone": "us-east-1d",
        "DisableApiTermination": "false",
        "ImageId": { "Ref": "ODAMI" },
        "InstanceType": "m3.large",
        "KeyName": { "Ref": "PemKey" },
        "SecurityGroupIds": [
          { "Ref": "DevDBSG" },
          { "Ref": "NATaccessSG" },
          { "Ref": "CheckMKSG" }
        ],
        "SubnetId": { "Ref": "PvtSNd" },
        "Tags": [
			{ "Key" : "Name", "Value" : "ms238cpodsql09d" },
			{ "Key" : "Application_Id", "Value" : { "Ref" : "ApplicationId" } },
			{ "Key" : "Application_Name", "Value" : { "Ref" : "ApplicationName" } },
			{ "Key" : "Environment", "Value" : { "Ref" : "Environment" } },
			{ "Key" : "PO_Number", "Value" : { "Ref" : "PONumber" } },
			{ "Key" : "Project_ID", "Value" : { "Ref" : "ProjectId" } },
			{ "Key" : "Owner", "Value" : { "Ref" : "Owner" } },
			{ "Key" : "Approver", "Value" : { "Ref" : "Approver" } }
        ],
        "UserData": {
          "Fn::Base64": {
            "Fn::Join": [
              "",
              [
                "<powershell>\n",
                "Rename-Computer -NewName ms238cpodsql09d -Restart\n",
                "</powershell>"
              ]
            ]
          }
        }
      }
    },
    "MS238CPODSQL11d": {
      "Type": "AWS::EC2::Instance",
      "Properties": {
        "AvailabilityZone": "us-east-1d",
        "DisableApiTermination": "false",
        "ImageId": "ami-a9acd0bf",
        "InstanceType": "m3.large",
        "KeyName": { "Ref": "PemKey" },
        "SecurityGroupIds": [
          { "Ref": "sgDBOD" },
          { "Ref": "NATaccessSG" },
          { "Ref": "CheckMKSG" }
        ],
        "SubnetId": { "Ref": "PvtSNd" },
        "Tags": [
			{ "Key" : "Name", "Value" : "ms238cpodsql11d" },
			{ "Key" : "Application_Id", "Value" : { "Ref" : "ApplicationId" } },
			{ "Key" : "Application_Name", "Value" : { "Ref" : "ApplicationName" } },
			{ "Key" : "Environment", "Value" : { "Ref" : "Environment" } },
			{ "Key" : "PO_Number", "Value" : { "Ref" : "PONumber" } },
			{ "Key" : "Project_ID", "Value" : { "Ref" : "ProjectId" } },
			{ "Key" : "Owner", "Value" : { "Ref" : "Owner" } },
			{ "Key" : "Approver", "Value" : { "Ref" : "Approver" } }
        ],
        "UserData": {
          "Fn::Base64": {
            "Fn::Join": [
              "",
              [
                "<powershell>\n",
                "Rename-Computer -NewName ms238cpodsql11d -Restart\n",
                "</powershell>"
              ]
            ]
          }
        }
      }
    },
	"sgDBOD" : {
		"Type" : "AWS::EC2::SecurityGroup",
		"Properties" : {
			"GroupDescription" : "CP OD DB SG",
			"VpcId" : { "Ref" : "VPCID" },
			"SecurityGroupIngress" : [ 
			{
				"IpProtocol" : "tcp",
				"FromPort" : "3389",
				"ToPort" : "3389",
				"CidrIp" : "10.0.0.0/8"
			},
			{
				"IpProtocol" : "tcp",
				"FromPort" : "1501",
				"ToPort" : "1512",
				"CidrIp" : "10.0.0.0/8"
			},
			{
				"IpProtocol" : "tcp",
				"FromPort" : "80",
				"ToPort" : "80",
				"CidrIp" : "10.0.0.0/8"
			},
			{
				"IpProtocol" : "tcp",
				"FromPort" : "8080",
				"ToPort" : "8080",
				"CidrIp" : "10.0.0.0/8"
			},
			{
				"IpProtocol" : "icmp",
				"FromPort" : "-1",
				"ToPort" : "-1",
				"CidrIp" : "10.0.0.0/8"
			}
			],
			"Tags" : [
				{ "Key" : "Name", "Value" : "sg/vpc_sysco_dev_01/cpdbod_dev_app" },
				{ "Key" : "Application_Name", "Value" : { "Ref" : "ApplicationName" } },
				{ "Key" : "Application_Id", "Value" : { "Ref" : "ApplicationId" } },
				{ "Key" : "Environment", "Value" : { "Ref" : "Environment" } },
				{ "Key" : "Cost_Center", "Value" : { "Ref" : "PONumber" } },
				{ "Key" : "PO_Number", "Value" : { "Ref" : "PONumber" } },
				{ "Key" : "Project_ID", "Value" : { "Ref" : "ProjectId" } },
				{ "Key" : "Owner", "Value" : { "Ref" : "Owner" } },
				{ "Key" : "Approver", "Value" : { "Ref" : "Approver" } }
			]
		}
	},
	"MS238CPUPSQL01d": {
		"Type": "AWS::EC2::Instance",
		"Metadata" : {
			"AWS::CloudFormation::Init" : { "config" : {
				"files" : {
					"c:\\cfn\\cfn-hup.conf" : { "content" : { "Fn::Join" : ["", [
						"[main]\n",
						"stack=", { "Ref" : "AWS::StackId" }, "\n",
						"region=", { "Ref" : "AWS::Region" }, "\n"
					]]}},
					"c:\\cfn\\hooks.d\\cfn-auto-reloader.conf" : { "content": { "Fn::Join" : ["", [
						"[cfn-auto-reloader-hook]\n",
						"triggers=post.update\n",
						"path=Resources.MS238CPUPSQL01d.Metadata.AWS::CloudFormation::Init\n",
						"action=cfn-init.exe -v -s ", { "Ref" : "AWS::StackId" }, " -r MS238CPUPSQL01d --region ", { "Ref" : "AWS::Region" }, "\n"
					]]}},
					"C:\\temp\\apache-tomcat-8.0.33-windows-x64.zip" :
						{ "source" : "http://archive.apache.org/dist/tomcat/tomcat-8/v8.0.33/bin/apache-tomcat-8.0.33-windows-x64.zip" },
					"c:\\temp\\StartupTask.bat" : { "content": { "Fn::Join" : ["", [
						"cd \\temp\n",
						"ECHO [default] > \"C:\\temp\\inputs.conf\"\n",
						"ECHO host = $decideOnStartup >> \"C:\\temp\\inputs.conf\"\n",
						"ECHO [script://$SPLUNK_HOME\\bin\\scripts\\splunk-wmi.path] >> \"C:\\temp\\inputs.conf\"\n",
						"ECHO disabled = 0 >> \"C:\\temp\\inputs.conf\"\n",
						
						"ECHO [tcpout] > \"C:\\temp\\outputs.conf\"\n",
						"ECHO defaultGroup = default-autolb-group >> \"C:\\temp\\outputs.conf\"\n",
						"ECHO [tcpout:default-autolb-group] >> \"C:\\temp\\outputs.conf\"\n",
						"ECHO server = splunkindex.na.sysco.net:9997 >> \"C:\\temp\\outputs.conf\"\n",
						"ECHO [tcpout-server://splunkindex.na.sysco.net:9997] >> \"C:\\temp\\outputs.conf\"\n",

						"ECHO [target-broker:deploymentServer] > \"C:\\Program Files\\SplunkUniversalForwarder\\etc\\system\\local\\deploymentclient.conf\"\n",
						"ECHO targetUri = splunkdeploy.na.sysco.net:8089 >> \"C:\\Program Files\\SplunkUniversalForwarder\\etc\\system\\local\\deploymentclient.conf\"\n",
						"ECHO [deployment-client] >> \"C:\\Program Files\\SplunkUniversalForwarder\\etc\\system\\local\\deploymentclient.conf\"\n",
						"ECHO clientName = cpup $HOSTNAME >> \"C:\\Program Files\\SplunkUniversalForwarder\\etc\\system\\local\\deploymentclient.conf\"\n",

						"powershell.exe -nologo -noprofile -command \"& { Add-Type -A 'System.IO.Compression.FileSystem'; [IO.Compression.ZipFile]::ExtractToDirectory('apache-tomcat-8.0.33-windows-x64.zip', 'C:\\Program Files\\Tomcat\\'); }\"\n",
						"aws s3 cp s3://sysco-nonprod-codedeploy-us-east-1/CloudPricing_UpdateService/", { "Ref" : "EnvironmentShort" }, "/properties/UpdateCP.cmd C:\\temp\\UpdateCP.cmd\n",
						"aws s3 cp s3://sysco-nonprod-codedeploy-us-east-1/CloudPricing_UpdateService/", { "Ref" : "EnvironmentShort" }, "/properties/CreateTask.xml C:\\temp\\CreateTask.xml\n",
						"%windir%/System32/schtasks /Create /F /tn \"Cloud Pricing - Startup Task\" /xml C:\\temp\\CreateTask.xml\n",

						"set CATALINA_HOME=C:\\Program Files\\Tomcat\\apache-tomcat-8.0.33\n",
						"\"C:\\Program Files\\Tomcat\\apache-tomcat-8.0.33\\bin\\service.bat\" install\n",
						"C:\\temp\\UpdateCP.cmd\n"
					]]}}
				},
				"commands" : {
					"1-StartupTask" : { "command" : "C:\\temp\\StartupTask.bat" }
				},
				"services" : { "windows" : { "cfn-hup" : {
					"enabled" : "true",
					"ensureRunning" : "true",
					"files" : ["c:\\cfn\\cfn-hup.conf", "c:\\cfn\\hooks.d\\cfn-auto-reloader.conf"]
				}}}
			}}
		},
		"Properties": {
			"AvailabilityZone": "us-east-1c",
			"DisableApiTermination": "false",
			"ImageId": "ami-16119f01",
			"InstanceType": "r4.large",
			"IamInstanceProfile" : { "Ref" : "InstanceProfileUpdateServer" },
			"KeyName": { "Ref": "PemKey2" },
			"SecurityGroupIds": [ { "Ref": "DevDBSG" }, { "Ref" : "NATaccessSG" }, { "Ref" : "CheckMKSG" } ],
			"SubnetId": { "Ref": "PvtSNc" },
			"Tags": [
				{ "Key": "Name", "Value": "MS238CPUPSQL01d" },
				{ "Key": "Application_Name", "Value": { "Ref": "ApplicationName" } },
				{ "Key": "Application_Id", "Value": { "Ref": "ApplicationId" } },
				{ "Key": "Environment", "Value": { "Ref": "Environment" } },
				{ "Key": "PO_Number", "Value": { "Ref": "PONumber" } },
				{ "Key": "Project_ID", "Value": { "Ref": "ProjectId" } },
				{ "Key": "Owner", "Value": { "Ref": "Owner" } },
				{ "Key": "Approver", "Value": { "Ref": "Approver" } }
			],
			"UserData" : { "Fn::Base64" : { "Fn::Join" : [ "", [
				"<script>\n",
				"cfn-init.exe -v -s ", { "Ref" : "AWS::StackId" }, " -r MS238CPUPSQL01d --region ", { "Ref" : "AWS::Region" }, "\n",
				"</script>"
			]]}}
		}
	},
	"MS238CPUPSQL02d": {
		"Type": "AWS::EC2::Instance",
		"Metadata" : {
			"AWS::CloudFormation::Init" : { "config" : {
				"files" : {
					"c:\\cfn\\cfn-hup.conf" : { "content" : { "Fn::Join" : ["", [
						"[main]\n",
						"stack=", { "Ref" : "AWS::StackId" }, "\n",
						"region=", { "Ref" : "AWS::Region" }, "\n"
					]]}},
					"c:\\cfn\\hooks.d\\cfn-auto-reloader.conf" : { "content": { "Fn::Join" : ["", [
						"[cfn-auto-reloader-hook]\n",
						"triggers=post.update\n",
						"path=Resources.MS238CPUPSQL02d.Metadata.AWS::CloudFormation::Init\n",
						"action=cfn-init.exe -v -s ", { "Ref" : "AWS::StackId" }, " -r MS238CPUPSQL02d --region ", { "Ref" : "AWS::Region" }, "\n"
					]]}},
					"C:\\temp\\apache-tomcat-8.0.33-windows-x64.zip" :
						{ "source" : "http://archive.apache.org/dist/tomcat/tomcat-8/v8.0.33/bin/apache-tomcat-8.0.33-windows-x64.zip" },
					"c:\\temp\\StartupTask.bat" : { "content": { "Fn::Join" : ["", [
						"cd \\temp\n",
						"ECHO [default] > \"C:\\temp\\inputs.conf\"\n",
						"ECHO host = $decideOnStartup >> \"C:\\temp\\inputs.conf\"\n",
						"ECHO [script://$SPLUNK_HOME\\bin\\scripts\\splunk-wmi.path] >> \"C:\\temp\\inputs.conf\"\n",
						"ECHO disabled = 0 >> \"C:\\temp\\inputs.conf\"\n",
						
						"ECHO [tcpout] > \"C:\\temp\\outputs.conf\"\n",
						"ECHO defaultGroup = default-autolb-group >> \"C:\\temp\\outputs.conf\"\n",
						"ECHO [tcpout:default-autolb-group] >> \"C:\\temp\\outputs.conf\"\n",
						"ECHO server = splunkindex.na.sysco.net:9997 >> \"C:\\temp\\outputs.conf\"\n",
						"ECHO [tcpout-server://splunkindex.na.sysco.net:9997] >> \"C:\\temp\\outputs.conf\"\n",

						"ECHO [target-broker:deploymentServer] > \"C:\\Program Files\\SplunkUniversalForwarder\\etc\\system\\local\\deploymentclient.conf\"\n",
						"ECHO targetUri = splunkdeploy.na.sysco.net:8089 >> \"C:\\Program Files\\SplunkUniversalForwarder\\etc\\system\\local\\deploymentclient.conf\"\n",
						"ECHO [deployment-client] >> \"C:\\Program Files\\SplunkUniversalForwarder\\etc\\system\\local\\deploymentclient.conf\"\n",
						"ECHO clientName = cpup $HOSTNAME >> \"C:\\Program Files\\SplunkUniversalForwarder\\etc\\system\\local\\deploymentclient.conf\"\n",

						"powershell.exe -nologo -noprofile -command \"& { Add-Type -A 'System.IO.Compression.FileSystem'; [IO.Compression.ZipFile]::ExtractToDirectory('apache-tomcat-8.0.33-windows-x64.zip', 'C:\\Program Files\\Tomcat\\'); }\"\n",
						"aws s3 cp s3://sysco-nonprod-codedeploy-us-east-1/CloudPricing_UpdateService/", { "Ref" : "EnvironmentShort" }, "/properties/UpdateCP.cmd C:\\temp\\UpdateCP.cmd\n",
						"aws s3 cp s3://sysco-nonprod-codedeploy-us-east-1/CloudPricing_UpdateService/", { "Ref" : "EnvironmentShort" }, "/properties/CreateTask.xml C:\\temp\\CreateTask.xml\n",
						"%windir%/System32/schtasks /Create /F /tn \"Cloud Pricing - Startup Task\" /xml C:\\temp\\CreateTask.xml\n",

						"set CATALINA_HOME=C:\\Program Files\\Tomcat\\apache-tomcat-8.0.33\n",
						"\"C:\\Program Files\\Tomcat\\apache-tomcat-8.0.33\\bin\\service.bat\" install\n",
						"C:\\temp\\UpdateCP.cmd\n"
					]]}}
				},
				"commands" : {
					"1-StartupTask" : { "command" : "C:\\temp\\StartupTask.bat" }
				},
				"services" : { "windows" : { "cfn-hup" : {
					"enabled" : "true",
					"ensureRunning" : "true",
					"files" : ["c:\\cfn\\cfn-hup.conf", "c:\\cfn\\hooks.d\\cfn-auto-reloader.conf"]
				}}}
			}}
		},
		"Properties": {
			"AvailabilityZone": "us-east-1e",
			"DisableApiTermination": "false",
			"ImageId": "ami-16119f01",
			"InstanceType": "r4.large",
			"IamInstanceProfile" : { "Ref" : "InstanceProfileUpdateServer" },
			"KeyName": { "Ref": "PemKey2" },
			"SecurityGroupIds": [ { "Ref": "DevDBSG" }, { "Ref" : "NATaccessSG" }, { "Ref" : "CheckMKSG" } ],
			"SubnetId": { "Ref": "PvtSNe" },
			"Tags": [
				{ "Key": "Name", "Value": "MS238CPUPSQL02d" },
				{ "Key": "Application_Name", "Value": { "Ref": "ApplicationName" } },
				{ "Key": "Application_Id", "Value": { "Ref": "ApplicationId" } },
				{ "Key": "Environment", "Value": { "Ref": "Environment" } },
				{ "Key": "PO_Number", "Value": { "Ref": "PONumber" } },
				{ "Key": "Project_ID", "Value": { "Ref": "ProjectId" } },
				{ "Key": "Owner", "Value": { "Ref": "Owner" } },
				{ "Key": "Approver", "Value": { "Ref": "Approver" } }
			],
			"UserData" : { "Fn::Base64" : { "Fn::Join" : [ "", [
				"<script>\n",
				"cfn-init.exe -v -s ", { "Ref" : "AWS::StackId" }, " -r MS238CPUPSQL02d --region ", { "Ref" : "AWS::Region" }, "\n",
				"</script>"
			]]}}
		}
	},
	"MS238CPUPSQL04d": {
		"Type": "AWS::EC2::Instance",
		"Metadata" : {
			"AWS::CloudFormation::Init" : { "config" : {
				"files" : {
					"c:\\cfn\\cfn-hup.conf" : { "content" : { "Fn::Join" : ["", [
						"[main]\n",
						"stack=", { "Ref" : "AWS::StackId" }, "\n",
						"region=", { "Ref" : "AWS::Region" }, "\n"
					]]}},
					"c:\\cfn\\hooks.d\\cfn-auto-reloader.conf" : { "content": { "Fn::Join" : ["", [
						"[cfn-auto-reloader-hook]\n",
						"triggers=post.update\n",
						"path=Resources.MS238CPUPSQL04d.Metadata.AWS::CloudFormation::Init\n",
						"action=cfn-init.exe -v -s ", { "Ref" : "AWS::StackId" }, " -r MS238CPUPSQL04d --region ", { "Ref" : "AWS::Region" }, "\n"
					]]}},
					"C:\\temp\\apache-tomcat-8.0.33-windows-x64.zip" :
						{ "source" : "http://archive.apache.org/dist/tomcat/tomcat-8/v8.0.33/bin/apache-tomcat-8.0.33-windows-x64.zip" },
					"c:\\temp\\StartupTask.bat" : { "content": { "Fn::Join" : ["", [
						"cd \\temp\n",
						"ECHO [default] > \"C:\\temp\\inputs.conf\"\n",
						"ECHO host = $decideOnStartup >> \"C:\\temp\\inputs.conf\"\n",
						"ECHO [script://$SPLUNK_HOME\\bin\\scripts\\splunk-wmi.path] >> \"C:\\temp\\inputs.conf\"\n",
						"ECHO disabled = 0 >> \"C:\\temp\\inputs.conf\"\n",
						
						"ECHO [tcpout] > \"C:\\temp\\outputs.conf\"\n",
						"ECHO defaultGroup = default-autolb-group >> \"C:\\temp\\outputs.conf\"\n",
						"ECHO [tcpout:default-autolb-group] >> \"C:\\temp\\outputs.conf\"\n",
						"ECHO server = splunkindex.na.sysco.net:9997 >> \"C:\\temp\\outputs.conf\"\n",
						"ECHO [tcpout-server://splunkindex.na.sysco.net:9997] >> \"C:\\temp\\outputs.conf\"\n",

						"ECHO [target-broker:deploymentServer] > \"C:\\Program Files\\SplunkUniversalForwarder\\etc\\system\\local\\deploymentclient.conf\"\n",
						"ECHO targetUri = splunkdeploy.na.sysco.net:8089 >> \"C:\\Program Files\\SplunkUniversalForwarder\\etc\\system\\local\\deploymentclient.conf\"\n",
						"ECHO [deployment-client] >> \"C:\\Program Files\\SplunkUniversalForwarder\\etc\\system\\local\\deploymentclient.conf\"\n",
						"ECHO clientName = cpup $COMPUTERNAME >> \"C:\\Program Files\\SplunkUniversalForwarder\\etc\\system\\local\\deploymentclient.conf\"\n",

						"powershell.exe -nologo -noprofile -command \"& { Add-Type -A 'System.IO.Compression.FileSystem'; [IO.Compression.ZipFile]::ExtractToDirectory('apache-tomcat-8.0.33-windows-x64.zip', 'C:\\Program Files\\Tomcat\\'); }\"\n",
						"aws s3 cp s3://sysco-nonprod-codedeploy-us-east-1/CloudPricing_UpdateService/", { "Ref" : "EnvironmentShort" }, "/properties/UpdateCP.cmd C:\\temp\\UpdateCP.cmd\n",
						"aws s3 cp s3://sysco-nonprod-codedeploy-us-east-1/CloudPricing_UpdateService/", { "Ref" : "EnvironmentShort" }, "/properties/CreateTask.xml C:\\temp\\CreateTask.xml\n",
						"%windir%/System32/schtasks /Create /F /tn \"Cloud Pricing - Startup Task\" /xml C:\\temp\\CreateTask.xml\n",

						"set CATALINA_HOME=C:\\Program Files\\Tomcat\\apache-tomcat-8.0.33\n",
						"\"C:\\Program Files\\Tomcat\\apache-tomcat-8.0.33\\bin\\service.bat\" install\n",
						"C:\\temp\\UpdateCP.cmd\n"
					]]}}
				},
				"commands" : {
					"1-StartupTask" : { "command" : "C:\\temp\\StartupTask.bat" }
				},
				"services" : { "windows" : { "cfn-hup" : {
					"enabled" : "true",
					"ensureRunning" : "true",
					"files" : ["c:\\cfn\\cfn-hup.conf", "c:\\cfn\\hooks.d\\cfn-auto-reloader.conf"]
				}}}
			}}
		},
		"Properties": {
			"AvailabilityZone": "us-east-1e",
			"DisableApiTermination": "false",
			"ImageId": "ami-8333f295",
			"InstanceType": "r3.xlarge",
			"IamInstanceProfile" : { "Ref" : "InstanceProfileUpdateServer" },
			"KeyName": { "Ref": "PemKey2" },
			"SecurityGroupIds": [ { "Ref": "DevDBSG" }, { "Ref" : "NATaccessSG" }, { "Ref" : "CheckMKSG" } ],
			"SubnetId": { "Ref": "PvtSNe" },
			"Tags": [
				{ "Key": "Name", "Value": "MS238CPUPSQL04d" },
				{ "Key": "Application_Name", "Value": { "Ref": "ApplicationName" } },
				{ "Key": "Application_Id", "Value": { "Ref": "ApplicationId" } },
				{ "Key": "Environment", "Value": { "Ref": "Environment" } },
				{ "Key": "PO_Number", "Value": { "Ref": "PONumber" } },
				{ "Key": "Project_ID", "Value": { "Ref": "ProjectId" } },
				{ "Key": "Owner", "Value": { "Ref": "Owner" } },
				{ "Key": "Approver", "Value": { "Ref": "Approver" } }
			],
			"UserData" : { "Fn::Base64" : { "Fn::Join" : [ "", [
				"<script>\n",
				"cfn-init.exe -v -s ", { "Ref" : "AWS::StackId" }, " -r MS238CPUPSQL04d --region ", { "Ref" : "AWS::Region" }, "\n",
				"</script>"
			]]}}
		}
	},
	"MS238CPIDE01": {
		"Type": "AWS::EC2::Instance",
		"Properties": {
			"AvailabilityZone": "us-east-1d",
			"DisableApiTermination": "false",
			"ImageId": { "Ref": "ODAMI" },
			"InstanceType": "c4.xlarge",
			"KeyName": { "Ref": "PemKey" },
			"SecurityGroupIds": [ { "Ref": "DevDBSG" },{ "Ref" : "NATaccessSG" },{ "Ref" : "CheckMKSG" } ],
			"SubnetId": { "Ref": "PvtSNd" },
			"Tags": [
				{ "Key": "Name", "Value": "MS238CPIDE01d" },
				{ "Key": "Application_Name", "Value": { "Ref": "ApplicationName" } },
				{ "Key": "Application_Id", "Value": { "Ref": "ApplicationId" } },
				{ "Key": "Environment", "Value": { "Ref": "Environment" } },
				{ "Key": "PO_Number", "Value": { "Ref": "PONumber" } },
				{ "Key": "Project_ID", "Value": { "Ref": "ProjectId" } },
				{ "Key": "Owner", "Value": { "Ref": "Owner" } },
				{ "Key": "Approver", "Value": { "Ref": "Approver" } }
			],
			"UserData": {
				"Fn::Base64": { "Fn::Join": [ "", [
					"<powershell>\n",
					"Rename-Computer -NewName MS238CPIDE01 -Restart\n",
					"</powershell>"
				]]}
			}
		}
    },
	"MS238CPIDE02": {
		"Type": "AWS::EC2::Instance",
		"Properties": {
			"AvailabilityZone": "us-east-1d",
			"DisableApiTermination": "false",
			"ImageId": { "Ref": "ODAMI" },
			"InstanceType": "c4.xlarge",
			"KeyName": { "Ref": "PemKey" },
			"SecurityGroupIds": [ { "Ref": "DevDBSG" },{ "Ref": "NATaccessSG" },{ "Ref": "CheckMKSG" } ],
			"SubnetId": { "Ref": "PvtSNd" },
			"Tags": [
				{ "Key": "Name", "Value": "MS238CPIDE02d" },
				{ "Key": "Application_Name", "Value": { "Ref": "ApplicationName" } },
				{ "Key": "Application_Id", "Value": { "Ref": "ApplicationId" } },
				{ "Key": "Environment", "Value": { "Ref": "Environment" } },
				{ "Key": "PO_Number", "Value": { "Ref": "PONumber" } },
				{ "Key": "Project_ID", "Value": { "Ref": "ProjectId" } },
				{ "Key": "Owner", "Value": { "Ref": "Owner" } },
				{ "Key": "Approver", "Value": { "Ref": "Approver" } }
			],
			"UserData" : { "Fn::Base64" : { "Fn::Join" : ["", [
				"<powershell>\n",
				"Rename-Computer -NewName MS238CPIDE02 -Restart\n",
				"</powershell>"
			]]}}
		}
	},
	"MS238CPIDE02d": {
		"Type": "AWS::EC2::Instance",
		"Properties": {
			"AvailabilityZone": "us-east-1d",
			"DisableApiTermination": "false",
			"ImageId": "ami-bd3ba0aa",
			"InstanceType": "c4.xlarge",
			"KeyName": { "Ref": "PemKey2" },
			"SecurityGroupIds": [ { "Ref": "DevDBSG" },{ "Ref": "NATaccessSG" },{ "Ref": "CheckMKSG" } ],
			"SubnetId": { "Ref": "PvtSNd" },
			"BlockDeviceMappings": [{
				"DeviceName": "/dev/sda1",
				"Ebs": { "VolumeSize": "750", "VolumeType": "gp2" }
			}],
			"Tags": [
				{ "Key": "Name", "Value": "MS238CPIDE02d" },
				{ "Key": "Application_Name", "Value": { "Ref": "ApplicationName" } },
				{ "Key": "Application_Id", "Value": { "Ref": "ApplicationId" } },
				{ "Key": "Environment", "Value": { "Ref": "Environment" } },
				{ "Key": "PO_Number", "Value": { "Ref": "PONumber" } },
				{ "Key": "Project_ID", "Value": { "Ref": "ProjectId" } },
				{ "Key": "Owner", "Value": { "Ref": "Owner" } },
				{ "Key": "Approver", "Value": { "Ref": "Approver" } }
			],
			"UserData" : { "Fn::Base64" : { "Fn::Join" : ["", [
				"<powershell>\n",
				"Rename-Computer -NewName MS238CPIDE02d -Restart\n",
				"</powershell>"
			]]}}
		}
	},
	"MS238CPIDE03d": {
		"Type": "AWS::EC2::Instance",
		"Properties": {
			"AvailabilityZone": "us-east-1d",
			"DisableApiTermination": "false",
			"ImageId": "ami-35c43858",
			"InstanceType": "c4.xlarge",
			"KeyName": { "Ref": "PemKey2" },
			"SecurityGroupIds": [ { "Ref": "DevDBSG" },{ "Ref": "NATaccessSG" } ],
			"SubnetId": { "Ref": "PvtSNd" },
			"BlockDeviceMappings": [{
				"DeviceName": "/dev/sda1",
				"Ebs": { "VolumeSize": "500", "VolumeType": "gp2" }
			}],
			"Tags": [
				{ "Key": "Name", "Value": "MS238CPIDE03d" },
				{ "Key": "Application_Name", "Value": { "Ref": "ApplicationName" } },
				{ "Key": "Application_Id", "Value": { "Ref": "ApplicationId" } },
				{ "Key": "Environment", "Value": { "Ref": "Environment" } },
				{ "Key": "PO_Number", "Value": { "Ref": "PONumber" } },
				{ "Key": "Project_ID", "Value": { "Ref": "ProjectId" } },
				{ "Key": "Owner", "Value": { "Ref": "Owner" } },
				{ "Key": "Approver", "Value": { "Ref": "Approver" } }
			],
			"UserData" : { "Fn::Base64" : { "Fn::Join" : ["", [
				"<powershell>\n",
				"Rename-Computer -NewName MS238CPIDE03d -Restart\n",
				"</powershell>"
			]]}}
		}
	},
	"MS238CPIDE04d": {
		"Type": "AWS::EC2::Instance",
		"Properties": {
			"AvailabilityZone": "us-east-1d",
			"DisableApiTermination": "false",
			"ImageId": "ami-d03d65c7",
			"InstanceType": "t2.xlarge",
			"KeyName": { "Ref": "PemKey2" },
			"SecurityGroupIds": [ { "Ref": "DevDBSG" },{ "Ref": "NATaccessSG" } ],
			"SubnetId": { "Ref": "PvtSNd" },
			"BlockDeviceMappings": [{
				"DeviceName": "/dev/sda1",
				"Ebs": { "VolumeSize": "500", "VolumeType": "gp2" }
			}],
			"Tags": [
				{ "Key": "Name", "Value": "MS238CPIDE04d" },
				{ "Key": "Application_Name", "Value": { "Ref": "ApplicationName" } },
				{ "Key": "Application_Id", "Value": { "Ref": "ApplicationId" } },
				{ "Key": "Environment", "Value": { "Ref": "Environment" } },
				{ "Key": "PO_Number", "Value": { "Ref": "PONumber" } },
				{ "Key": "Project_ID", "Value": { "Ref": "ProjectId" } },
				{ "Key": "Owner", "Value": { "Ref": "Owner" } },
				{ "Key": "Approver", "Value": { "Ref": "Approver" } }
			],
			"UserData" : { "Fn::Base64" : { "Fn::Join" : ["", [
				"<powershell>\n",
				"Rename-Computer -NewName MS238CPIDE04d -Restart\n",
				"</powershell>"
			]]}}
		}
	},
	"MS238CPIDE05d": {
		"Type": "AWS::EC2::Instance",
		"Properties": {
			"AvailabilityZone": "us-east-1d",
			"DisableApiTermination": "false",
			"ImageId": "ami-782ab66e",
			"InstanceType": "t2.xlarge",
			"KeyName": { "Ref": "PemKey2" },
			"IamInstanceProfile" : { "Ref" : "InstanceProfileMCP" },
			"SecurityGroupIds": [ { "Ref": "DevDBSG" },{ "Ref" : "NATaccessSG" },{ "Ref" : "CheckMKSG" } ],
			"SubnetId": { "Ref": "PvtSNd" },
			"BlockDeviceMappings" : [ {
				"DeviceName" : "/dev/sda1",
				"Ebs" : {
					"VolumeSize" : "200",
					"VolumeType" : "gp2"
				},
				"DeviceName" : "xvdb",
				"Ebs" : {
					"VolumeSize" : "200",
					"VolumeType" : "gp2"
				}
			} ],
			"Tags": [
				{ "Key": "Name", "Value": "MS238CPIDE05d" },
				{ "Key": "Application_Name", "Value": { "Ref": "ApplicationName" } },
				{ "Key": "Application_Id", "Value": { "Ref": "ApplicationId" } },
				{ "Key": "Environment", "Value": { "Ref": "Environment" } },
				{ "Key": "PO_Number", "Value": { "Ref": "PONumber" } },
				{ "Key": "Project_ID", "Value": { "Ref": "ProjectId" } },
				{ "Key": "Owner", "Value": { "Ref": "Owner" } },
				{ "Key": "Approver", "Value": { "Ref": "Approver" } }
			],
			"UserData": {
				"Fn::Base64": { "Fn::Join": [ "", [
					"<powershell>\n",
					"Rename-Computer -NewName MS238CPIDE05d -Restart\n",
					"</powershell>"
				]]}
			}
		}
    },
	"lx238cpide04d": {
		"Type": "AWS::EC2::Instance",
		"Properties": {
			"AvailabilityZone": "us-east-1d",
			"DisableApiTermination": "false",
			"ImageId" : "ami-6da7ab07",
			"InstanceType": "t2.xlarge",
			"KeyName": { "Ref": "PemKey2" },
			"SecurityGroupIds": [ { "Ref": "DevDBSG" },{ "Ref": "NATaccessSG" } ],
			"SubnetId": { "Ref": "PvtSNd" },
			"BlockDeviceMappings" : [ {
				"DeviceName" : "/dev/sda1",
				"Ebs" : {
					"VolumeSize" : "200",
					"VolumeType" : "gp2"
				}
			} ],
			"Tags": [
				{ "Key": "Name", "Value": "lx238cpide04d" },
				{ "Key": "Application_Name", "Value": { "Ref": "ApplicationName" } },
				{ "Key": "Application_Id", "Value": { "Ref": "ApplicationId" } },
				{ "Key": "Environment", "Value": { "Ref": "Environment" } },
				{ "Key": "PO_Number", "Value": { "Ref": "PONumber" } },
				{ "Key": "Project_ID", "Value": { "Ref": "ProjectId" } },
				{ "Key": "Owner", "Value": { "Ref": "Owner" } },
				{ "Key": "Approver", "Value": { "Ref": "Approver" } }
			],
			"UserData" : { "Fn::Base64" : { "Fn::Join" : ["", [
				"#!/bin/bash -v\n",
				"date > /home/ec2-user/starttime\n",
				"yum update -y aws-cfn-bootstrap\n",
				"yum update -y wget\n",
				"yum update -y curl\n",
				
				"# Set Timezone\n",
				"timedatectl set-timezone UTC\n",

				"# Install lsof locate and smbclient\n",
				"yum install -y sysstat lsof mlocate samba-client\n",

				"#Change Name of server to match new hostname\n",
				"hostname lx238cpide04d.na.sysco.net\n",
				"echo lx238cpide04d.na.sysco.net > /etc/hostname","\n",
				"# sh -c \"hostname  cpmcp-$(curl http://169.254.169.254/latest/meta-data/local-ipv4/ -s)d.na.sysco.net\"\n",
				"#sh -c \"echo  cpmcp-$(curl http://169.254.169.254/latest/meta-data/local-ipv4/ -s)d.na.sysco.net\" > /etc/hostname\n",

				"####################################\n",
				"#Add Users to server\n",
				"####################################\n",
				"useradd -m -g aix -c \"James Owen, Cloud Enablement Team\" jowe6212\n",
				"useradd -m -g aix -c \"Mike Rowland, Enterprise Architect\" mrow7849\n",
				"useradd -m -g aix -c \"Fernando Nieto, App Dev\" fnie6886\n",
				"useradd -m -g aix -c \"Sagar Shetty, App Dev\" sshe7956\n",

				"####################################\n",
				"# Download and Install java\n",
				"####################################\n",
				"cd /tmp\n",
				"wget --no-cookies --no-check-certificate --header \"Cookie: gpw_e24=http%3A%2F%2Fwww.oracle.com%2F; oraclelicense=accept-securebackup-cookie\" \"http://download.oracle.com/otn-pub/java/jdk/8u45-b14/jdk-8u45-linux-x64.rpm\"\n",
				"rpm -ivh jdk-8u45-linux-x64.rpm\n",

				"####################################\n",
				"# Increase open file limits\n",
				"####################################\n",
				"sh -c \"echo \\\"*   soft   nofile   10240\\\" >> /etc/security/limits.conf\"\n",
				"sh -c \"echo \\\"*   hard   nofile   20240\\\" >> /etc/security/limits.conf\"\n",

				"####################################\n",
				"# Install tomcat\n",
				"####################################\n",
				"groupadd tomcat\n",
				"useradd tomcat -b /app -g tomcat -e \"\"\n",
				"cd /tmp\n",
				"wget http://archive.apache.org/dist/tomcat/tomcat-8/v8.5.4/bin/apache-tomcat-8.5.4.tar.gz\n",
				"tar xzf apache-tomcat-8.5.4.tar.gz\n",
				"mv apache-tomcat-8.5.4 /usr/local/tomcat8\n",

				"# Set System Environment and Tomcat JVM Heap size\n",
				"#-----------------------------------\n",
				"#sh -c \"echo 'export SERVER_ENVIRONMENT_VARIABLE=", { "Ref" : "EnvironmentShort" }, "'\" > /etc/profile.d/cpwebservice.sh\n",
				"#sh -c \"echo 'export CATALINA_OPTS=\\\"-Xms1024M -Xmx8196M\\\"'\" >> /etc/profile.d/cpwebservice.sh\n",
				"sh -c \"echo 'SERVER_ENVIRONMENT_VARIABLE=", { "Ref" : "EnvironmentShort" }, "'\" > /etc/environment\n",
				"sh -c \"echo 'CATALINA_OPTS=\\\"-Xms1024M -Xmx8196M\\\"'\" >> /etc/environment\n",

				"# Set Tomcat to restart after every reboot\n",
				"sh -c echo \"@reboot logger \\\"SYSTEM REBOOTED..Starting Tomcat...\\\" && /usr/local/tomcat8/bin/startup.sh\" | crontab - \n",

				"# Start Tomcat\n",
				"#-----------------------------------\n",
				"/usr/local/tomcat8/bin/startup.sh\n",

				"# Create settings folder\n",
				"mkdir /settings\n",
				"mkdir /settings/properties\n",
				"mkdir /settings/logs\n",
				"chown tomcat -R /settings\n",
				"chgrp -R -c ec2-user /settings\n",
				"chmod -R -c 777 /settings\n",

				"####################################\n",
				"# Install Splunk Universal Forwarder\n",
				"####################################\n",
				"cd /tmp\n",
				"wget -O splunkforwarder-6.5.3-36937ad027d4-linux-2.6-x86_64.rpm 'https://www.splunk.com/bin/splunk/DownloadActivityServlet?architecture=x86_64&platform=linux&version=6.5.3&product=universalforwarder&filename=splunkforwarder-6.5.3-36937ad027d4-linux-2.6-x86_64.rpm&wget=true'\n",
				"chmod 744 splunkforwarder-6.5.3-36937ad027d4-linux-2.6-x86_64.rpm\n",
				"rpm -i splunkforwarder-6.5.3-36937ad027d4-linux-2.6-x86_64.rpm\n",
				"cd /opt/splunkforwarder\n",
				"./bin/splunk start --accept-license\n",
				"./bin/splunk enable boot-start\n",

				"# Configure to run as a deployment client\n",
				"#-----------------------------------\n",
				"./bin/splunk set deploy-poll splunkdeploy.na.sysco.net:8089 -auth admin:changeme\n",

				"# Configure forwarder to send logs to Splunk Indexer\n",
				"#-----------------------------------\n",
				"./bin/splunk add forward-server splunkindex.na.sysco.net:9997 -auth admin:changeme\n",
				"./bin/splunk restart\n",

				"####################################\n",
				"# Install CodeDeploy\n",
				"####################################\n",
				"yum install ruby -y\n",
				"wget https://aws-codedeploy-us-east-1.s3.amazonaws.com/latest/install\n",
				"chmod +x ./install\n",
				"./install auto\n",
				
				"date > /home/ec2-user/stoptime\n"
			]]}}
		}
	},
	"lx238cpodsql01d": {
		"Type": "AWS::EC2::Instance",
		"Properties": {
			"AvailabilityZone": "us-east-1d",
			"DisableApiTermination": "false",
			"ImageId" : "ami-6da7ab07",
			"InstanceType": "t2.xlarge",
			"KeyName": { "Ref": "PemKey2" },
			"SecurityGroupIds": [ { "Ref": "DevDBSG" },{ "Ref": "NATaccessSG" } ],
			"SubnetId": { "Ref": "PvtSNd" },
			"BlockDeviceMappings" : [ {
				"DeviceName" : "/dev/sda1",
				"Ebs" : {
					"VolumeSize" : "200",
					"VolumeType" : "gp2"
				}
			} ],
			"Tags": [
				{ "Key": "Name", "Value": "lx238cpodsql01d" },
				{ "Key": "Application_Name", "Value": { "Ref": "ApplicationName" } },
				{ "Key": "Application_Id", "Value": { "Ref": "ApplicationId" } },
				{ "Key": "Environment", "Value": { "Ref": "Environment" } },
				{ "Key": "PO_Number", "Value": { "Ref": "PONumber" } },
				{ "Key": "Project_ID", "Value": { "Ref": "ProjectId" } },
				{ "Key": "Owner", "Value": { "Ref": "Owner" } },
				{ "Key": "Approver", "Value": { "Ref": "Approver" } }
			],
			"UserData" : { "Fn::Base64" : { "Fn::Join" : ["", [
				"#!/bin/bash -v\n",
				"date > /home/ec2-user/starttime\n",
				"yum update -y aws-cfn-bootstrap\n",
				"yum update -y wget\n",
				"yum update -y curl\n",
				
				"# Set Timezone\n",
				"timedatectl set-timezone UTC\n",

				"# Install lsof locate and smbclient\n",
				"yum install -y sysstat lsof mlocate samba-client\n",

				"#Change Name of server to match new hostname\n",
				"hostname lx238cpodsql01d.na.sysco.net\n",
				"echo lx238cpodsql01d.na.sysco.net > /etc/hostname","\n",
				"# sh -c \"hostname  cpodsql-$(curl http://169.254.169.254/latest/meta-data/local-ipv4/ -s)d.na.sysco.net\"\n",
				"#sh -c \"echo  cpodsql-$(curl http://169.254.169.254/latest/meta-data/local-ipv4/ -s)d.na.sysco.net\" > /etc/hostname\n",

				"####################################\n",
				"#Add Users to server\n",
				"####################################\n",
				"useradd -m -g aix -c \"James Owen, Cloud Enablement Team\" jowe6212\n",
				"useradd -m -g aix -c \"Mike Rowland, Enterprise Architect\" mrow7849\n",
				"useradd -m -g aix -c \"Fernando Nieto, App Dev\" fnie6886\n",
				"useradd -m -g aix -c \"Sagar Shetty, App Dev\" sshe7956\n",

				"####################################\n",
				"# Download and Install MS SQL Server 2017\n",
				"####################################\n",
				"cd /tmp\n",
				"# curl https://packages.microsoft.com/config/rhel/7/mssql-server.repo > /etc/yum.repos.d/mssql-server.repo\n",
				"# yum install -y mssql-server\n",

				"####################################\n",
				"# Increase open file limits\n",
				"####################################\n",
				"sh -c \"echo \\\"*   soft   nofile   10240\\\" >> /etc/security/limits.conf\"\n",
				"sh -c \"echo \\\"*   hard   nofile   20240\\\" >> /etc/security/limits.conf\"\n",

				"####################################\n",
				"# Install Splunk Universal Forwarder\n",
				"####################################\n",
				"cd /tmp\n",
				"wget -O splunkforwarder-6.6.1-aeae3fe0c5af-linux-2.6-x86_64.rpm 'https://www.splunk.com/bin/splunk/DownloadActivityServlet?architecture=x86_64&platform=linux&version=6.6.1&product=universalforwarder&filename=splunkforwarder-6.6.1-aeae3fe0c5af-linux-2.6-x86_64.rpm&wget=true'\n",
				"chmod 744 splunkforwarder-6.6.1-aeae3fe0c5af-linux-2.6-x86_64.rpm\n",
				"rpm -i splunkforwarder-6.6.1-aeae3fe0c5af-linux-2.6-x86_64.rpm\n",
				"cd /opt/splunkforwarder\n",
				"./bin/splunk start --accept-license\n",
				"./bin/splunk enable boot-start\n",

				"# Configure to run as a deployment client\n",
				"#-----------------------------------\n",
				"./bin/splunk set deploy-poll splunkdeploy.na.sysco.net:8089 -auth admin:changeme\n",

				"# Configure forwarder to send logs to Splunk Indexer\n",
				"#-----------------------------------\n",
				"./bin/splunk add forward-server splunkindex.na.sysco.net:9997 -auth admin:changeme\n",
				"./bin/splunk restart\n",

				"####################################\n",
				"# Install CodeDeploy\n",
				"####################################\n",
				"yum install ruby -y\n",
				"wget https://aws-codedeploy-us-east-1.s3.amazonaws.com/latest/install\n",
				"chmod +x ./install\n",
				"./install auto\n",
				
				"date > /home/ec2-user/stoptime\n"
			]]}}
		}
	}

	},
  "Outputs" : {
	"dbUrl" : {
		"Description" : "Endpoint for Common DB",
		"Value" : { "Fn::Join" : ["", [{ "Fn::GetAtt" : [ "CPDBClusterDEV", "Endpoint.Address" ]}]] }
	}
  }
}