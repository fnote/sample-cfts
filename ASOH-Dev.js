{
	"AWSTemplateFormatVersion" : "2010-09-09",

	"Description" : "Deployed via ASOH-Dev.js that resides in Sysco source control",

	"Parameters" : {

		"ApplicationName" : {
			"Description" : "Name of application",
			"Type" : "String",
			"Default" : "ASOH Dev",
			"MinLength" : "1",
			"MaxLength" : "255",
			"AllowedPattern" : "[\\x20-\\x7E]*",
			"ConstraintDescription" : "Must contain only ASCII characters."
		},
		"ApplicationId" : {
			"Description" : "Application ID",
			"Type" : "String",
			"Default" : "APP-001151",
			"MinLength" : "1",
			"MaxLength" : "255",
			"AllowedPattern" : "[\\x20-\\x7E]*",
			"ConstraintDescription" : "Must contain only ASCII characters."
		},
		"PONumber" : {
			"Description" : "PO Number for billing",
			"Type" : "String",
			"Default" : "7000000347",
			"MinLength" : "1",
			"MaxLength" : "255",
			"AllowedPattern" : "[\\x20-\\x7E]*",
			"ConstraintDescription" : "Must contain only ASCII characters."
		},
		"AMIImageId" : {
			"Description" : "20160323-RHEL-7-2-BASE - ami-6da7ab07",
			"Type" : "String",
			"Default" : "ami-6da7ab07",
			"AllowedPattern" : "^ami-[0-9a-fA-F]{8}",
			"ConstraintDescription" : "Must be a valid AMI."
		},
		"Approver" : {
			"Description" : "Name of application approver",
			"Type" : "String",
			"Default" : "Samir Patel James Owen",
			"MinLength" : "1",
			"MaxLength" : "255"
		},
		"Owner" : {
			"Description" : "Name of application owner",
			"Type" : "String",
			"Default" : "James Owen",
			"MinLength" : "1",
			"MaxLength" : "255"
		},
		"Environment" : {
			"Description" : "Environment for application",
			"Type" : "String",
			"Default" : "Development",
			"AllowedValues" : [
				"Sandbox",
				"Development",
				"Quality",
				"Staging",
				"Training",
				"Production"
			],
			"ConstraintDescription" : "Must be a valid environment."
		},
		"EnvironmentShort" : {
			"Description" : "Environment initials",
			"Type" : "String",
			"Default" : "DEV",
			"AllowedValues" : [
				"SBX",
				"DEV",
				"QA",
				"STG",
				"TRN",
				"PROD"
			],
			"ConstraintDescription" : "Must be a valid environment."
		},
		"ProjectId" : {
			"Description" : "Project ID",
			"Type" : "String",
			"Default" : "BT.001176",
			"MinLength" : "1",
			"MaxLength" : "255",
			"AllowedPattern" : "[\\x20-\\x7E]*",
			"ConstraintDescription" : "Must contain only ASCII characters."
		},
		"InstanceType" : {
			"Description" : "Application EC2 instance type",
			"Type" : "String",
			"Default" : "t2.micro",
			"AllowedValues" : [
				"t2.micro",
				"t2.medium",
				"t2.large",
				"m4.medium"
			],
			"ConstraintDescription" : "Must be a valid EC2 instance type."
		},
		"VPCID" : {
			"Description" : "vpc_sysco_nonprod_02 CIDR: 10.168.128.0/20",
			"Type" : "AWS::EC2::VPC::Id",
			"Default" : "vpc-ff88269a",
			"ConstraintDescription" : "Must be a valid VPC."
		},
		"NATaccessSG" : {
			"Description" : "NAT access Security Group",
			"Type" : "String",
			"Default" : "sg-e151a186",
			"ConstraintDescription" : "Must be a valid NAT Security Group."
		},
		"CheckMKSG" : {
			"Description" : "NAT access Security Group",
			"Type" : "String",
			"Default" : "sg-0f7fc468",
			"ConstraintDescription" : "Must be a valid NAT Security Group."
		},
		"KeyName" : {
			"Description" : "Name of an existing KeyPair",
			"Type" : "AWS::EC2::KeyPair::KeyName",
			"Default" : "ASOH_Dev",
			"MinLength" : "1",
			"MaxLength" : "255",
			"AllowedPattern" : "[\\x20-\\x7E]*",
			"ConstraintDescription" : "Must contain only ASCII characters."
		},
		"SubnetIdPrivateEastC" : {
			"Description" : "Private subnet for confidential apps in us-east-1c CIDR: 10.168.138.0/23",
			"Type" : "AWS::EC2::Subnet::Id",
			"Default" : "subnet-b61cbb9d",
			"MinLength" : "1",
			"MaxLength" : "255",
			"ConstraintDescription" : "Must be a valid Private Subnet."
		},
		"SubnetIdPrivateEastD" : {
			"Description" : "Private subnet for confidential apps in us-east-1d CIDR: 10.168.140.0/23",
			"Type" : "AWS::EC2::Subnet::Id",
			"Default" : "subnet-ea138a9d",
			"MinLength" : "1",
			"MaxLength" : "255",
			"ConstraintDescription" : "Must be a valid Private Subnet."
		},
		"SubnetIdPrivateEastE" : {
			"Description" : "Private subnet for confidential apps in us-east-1e CIDR: 10.168.142.0/23",
			"Type" : "AWS::EC2::Subnet::Id",
			"Default" : "subnet-2512501f",
			"MinLength" : "1",
			"MaxLength" : "255",
			"ConstraintDescription" : "Must be a valid Private Subnet."
		},
		"SubnetIdPublicEastC" : {
			"Description" : "Public subnet for the ELB in us-east-1c CIDR: 10.168.130.0/27",
			"Type" : "AWS::EC2::Subnet::Id",
			"Default" : "subnet-730a6c58",
			"MinLength" : "1",
			"MaxLength" : "255",
			"ConstraintDescription" : "Must be a valid Public Subnet."
		},
		"SubnetIdPublicEastD" : {
			"Description" : "Public subnet for the ELB in us-east-1d CIDR: 10.168.145.32/28",
			"Type" : "AWS::EC2::Subnet::Id",
			"Default" : "subnet-24fed553",
			"MinLength" : "1",
			"MaxLength" : "255",
			"ConstraintDescription" : "Must be a valid Public Subnet."
		},
		"InstanceProfile" : {
			"Description" : "Instance Profile Name",
			"Type" : "String",
			"Default" : "Sysco-ApplicationDefaultInstanceProfile-7L7ALUCW6DRW"
		},
		"RootVolumeSize" : {
			"Description" : "Size (GB) of root EBS volume for application instance",
			"Type" : "Number",
			"Default" : "65",
			"MinValue" : "10",
			"MaxValue" : "1024"
		},
		"SubnetAvailabilityZone" : {
			"Description" : "Availability Zone for subnet",
			"Type" : "String",
			"Default" : "us-east-1c",
			"AllowedValues" : [
				"us-east-1c",
				"us-east-1d",
				"us-east-1e"
			],
			"ConstraintDescription" : "Must be a valid Availability zone."
		}
	},

	"Resources" : {
		"WebServerGroup" : {
			"Type" : "AWS::AutoScaling::AutoScalingGroup",
			"Properties" : {
				"AvailabilityZones" : ["us-east-1c", "us-east-1d"],
				"LaunchConfigurationName" : { "Ref" : "WebLaunchConfig" },
				"MinSize" : "1",
				"MaxSize" : "2",
				"DesiredCapacity" : "1",
				"HealthCheckType": "EC2",
				"HealthCheckGracePeriod": "300",
				"VPCZoneIdentifier" : [ { "Ref" : "SubnetIdPrivateEastC" }, { "Ref" : "SubnetIdPrivateEastD" }],
				"Tags" : [ 
					{ "Key" : "Name", "Value" : { "Fn::Join" : ["", ["ASOH Autoscaling Group-", { "Ref" : "EnvironmentShort" }]]}, "PropagateAtLaunch" : "true" },
					{ "Key" : "Application_Name", "Value" : { "Ref" : "ApplicationName" }, "PropagateAtLaunch" : "true" },
					{ "Key" : "Application_Id", "Value" : { "Ref" : "ApplicationId" }, "PropagateAtLaunch" : "true" },
					{ "Key" : "Owner", "Value" : { "Ref" : "Owner" }, "PropagateAtLaunch" : "true" },
					{ "Key" : "Approver", "Value" : { "Ref" : "Approver" }, "PropagateAtLaunch" : "true" },
					{ "Key" : "Cost_Center", "Value" : { "Ref" : "PONumber" }, "PropagateAtLaunch" : "true" },
					{ "Key" : "PO_Number", "Value" : { "Ref" : "PONumber" }, "PropagateAtLaunch" : "true" },
					{ "Key" : "Environment", "Value" : { "Ref" : "Environment" }, "PropagateAtLaunch" : "true" },
					{ "Key" : "Project_ID", "Value" : { "Ref" : "ProjectId" }, "PropagateAtLaunch" : "true" }
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
		"WebLaunchConfig" : {
			"Type" : "AWS::AutoScaling::LaunchConfiguration",
			"Properties" : {
				"ImageId" : {"Ref" : "AMIImageId"},
				"InstanceType" : {"Ref" : "InstanceType"},
				"KeyName" : { "Ref" : "KeyName" },
				"SecurityGroups" : [{ "Ref" : "sgWeb" }, { "Ref" : "NATaccessSG" }, { "Ref" : "CheckMKSG" }],
				"IamInstanceProfile" : { "Ref" : "InstanceProfile" },
				"BlockDeviceMappings" : [ {
					"DeviceName" : "/dev/sda1",
					"Ebs" : {
						"VolumeSize" : { "Ref" : "RootVolumeSize" },
						"VolumeType" : "gp2"
					}
				} ],
				"UserData" : { "Fn::Base64" : { "Fn::Join" : ["", [
				"#!/bin/bash -v\n",
					"# Set Timezone\n",
					"timedatectl set-timezone UTC\n",
					"date > /home/ec2-user/starttime\n",

					"yum update -y aws-cfn-bootstrap\n",
					"yum update -y wget\n",
					"yum update -y curl\n",
					"yum install -y sysstat\n",

					"# Install smbclient\n",
					"yum install -y samba-client\n",

					"##############################################\n",
					"#Change hostname to include ip address\n",
					"##############################################\n",
					"sh -c \"hostname  asoh-$(curl http://169.254.169.254/latest/meta-data/local-ipv4/ -s)d.na.sysco.net\"\n",
					"sh -c \"echo  asoh-$(curl http://169.254.169.254/latest/meta-data/local-ipv4/ -s)d.na.sysco.net\" > /etc/hostname\n",

					"####################################\n",
					"#Add Users to server\n",
					"####################################\n",
					"useradd -m -g aix -c \"James Owen, Cloud Pricing Team\" jowe6212\n",
					"useradd -m -g aix -c \"Mike Rowland, Cloud Pricing Team\" mrow7849\n",
					"useradd -m -g aix -c \"Fernando Nieto, Cloud Pricing Team\" fnie6886\n",
					"useradd -m -g aix -c \"Ravi Goli, App Dev\" rgol4427\n",

					"####################################\n",
					"# Download and Install java\n",
					"####################################\n",
					"cd /tmp\n",
					"wget --no-cookies --no-check-certificate --header \"Cookie: gpw_e24=http%3A%2F%2Fwww.oracle.com%2F; oraclelicense=accept-securebackup-cookie\" \"http://download.oracle.com/otn-pub/java/jdk/8u45-b14/jdk-8u45-linux-x64.rpm\"\n",
					"rpm -ivh jdk-8u45-linux-x64.rpm\n",

					"####################################\n",
					"# Install tomcat\n",
					"####################################\n",
					"groupadd tomcat\n",
					"useradd tomcat -b /app -g tomcat -e \"\"\n",
					"cd /tmp\n",
					"wget http://archive.apache.org/dist/tomcat/tomcat-7/v7.0.68/bin/apache-tomcat-7.0.68.tar.gz\n",
					"tar xzf apache-tomcat-7.0.68.tar.gz\n",
					"mv apache-tomcat-7.0.68 /usr/local/tomcat7\n",
					
					"# Set Server Environment\n",
					"#-----------------------------------\n",
					"sh -c \"echo 'export SERVER_ENVIRONMENT_VARIABLE=", { "Ref" : "EnvironmentShort" }, "'\" > /etc/profile.d/asoh.sh\n",

					"# Set Tomcat Environment Variable\n",
					"#-----------------------------------\n",
					"# sh -c \"echo 'SERVER_ENVIRONMENT_VARIABLE=\"", { "Ref" : "EnvironmentShort" }, "\"'\" >> /usr/local/tomcat7/conf/tomcat.conf\n",

					"# Set Tomcat Set JVM Heap\n",
					"#-----------------------------------\n",
					"# sh -c \"echo 'JAVA_OPTS=\"-Xms1g -Xmx1g -XX:MaxPermSize=256m\"'\" >> /usr/local/tomcat7/conf/tomcat.conf\n",

					"# Start Tomcat\n",
					"#-----------------------------------\n",
					"# /usr/local/tomcat7/bin/startup.sh\n",

					"####################################\n",
					"# Create settings folder\n",
					"####################################\n",
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
					"wget -O splunkforwarder-6.4.1-debde650d26e-linux-2.6-x86_64.rpm 'https://www.splunk.com/bin/splunk/DownloadActivityServlet?architecture=x86_64&platform=linux&version=6.4.1&product=universalforwarder&filename=splunkforwarder-6.4.1-debde650d26e-linux-2.6-x86_64.rpm&wget=true'\n",
					"chmod 744 splunkforwarder-6.4.1-debde650d26e-linux-2.6-x86_64.rpm\n",
					"rpm -i splunkforwarder-6.4.1-debde650d26e-linux-2.6-x86_64.rpm\n",
					"cd /opt/splunkforwarder\n",
					"./bin/splunk start --accept-license\n",
					"./bin/splunk enable boot-start\n",

					"# Configure inputs.conf with local IP (For autoscaling groups)\n",
					"#-----------------------------------\n",
					"# echo [default] > /opt/splunkforwarder/etc/system/local/inputs.conf\n",
					"# sh -c \"echo 'host='cptest_$(curl http://169.254.169.254/latest/meta-data/local-ipv4/ -s)\" >> /opt/splunkforwarder/etc/system/local/inputs.conf\n",
					"# echo [script://$SPLUNK_HOME\\bin\\scripts\\splunk-wmi.path] >> /opt/splunkforwarder/etc/system/local/inputs.conf\n",
					"# echo disabled = 0 >> /opt/splunkforwarder/etc/system/local/inputs.conf\n",

					"# Configure to run as a deployment client\n",
					"#-----------------------------------\n",
					"./bin/splunk set deploy-poll splunkdeploy.na.sysco.net:8089 -auth admin:changeme\n",
					"# Poll deployment server every 15 minutes\n",
					"echo phoneHomeIntervalInSecs = 900 >> /opt/splunkforwarder/etc/system/local/deploymentclient.conf\n",
					"# echo [deployment-client] >> /opt/splunkforwarder/etc/system/local/deploymentclient.conf\n",
					"# sh -c \"echo 'clientName='cptest_$(curl http://169.254.169.254/latest/meta-data/local-ipv4/ -s)\" >> /opt/splunkforwarder/etc/system/local/deploymentclient.conf\n",

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
		"WebServerScaleUpPolicy" : {
			"Type" : "AWS::AutoScaling::ScalingPolicy",
			"Properties" : {
				"AdjustmentType" : "ChangeInCapacity",
				"AutoScalingGroupName" : { "Ref" : "WebServerGroup" },
				"Cooldown" : "300",
				"ScalingAdjustment" : "1"
			}
		},
		"WebServerScaleDownPolicy" : {
			"Type" : "AWS::AutoScaling::ScalingPolicy",
			"Properties" : {
				"AdjustmentType" : "ChangeInCapacity",
				"AutoScalingGroupName" : { "Ref" : "WebServerGroup" },
				"Cooldown" : "300",
				"ScalingAdjustment" : "-1"
			}
		},
		"WebCPUAlarmHigh" : {
			"Type" : "AWS::CloudWatch::Alarm",
			"Properties" : {
				"AlarmDescription" : "Scale-up if CPU > 90% for 10 minutes",
				"MetricName" : "CPUUtilization",
				"Namespace" : "AWS/EC2",
				"Statistic" : "Average",
				"Period" : "300",
				"EvaluationPeriods" : "2",
				"Threshold" : "90",
				"AlarmActions" : [ { "Ref" : "WebServerScaleUpPolicy" } ],
				"Dimensions" : [
				{
					"Name" : "AutoScalingGroupName",
					"Value" : { "Ref" : "WebServerGroup" }
				}],
				"ComparisonOperator" : "GreaterThanThreshold"
			}
		},
		"WebCPUAlarmLow" : {
			"Type" : "AWS::CloudWatch::Alarm",
			"Properties" : {
				"AlarmDescription" : "Scale-down if CPU < 70% for 10 minutes",
				"MetricName" : "CPUUtilization",
				"Namespace" : "AWS/EC2",
				"Statistic" : "Average",
				"Period" : "300",
				"EvaluationPeriods" : "2",
				"Threshold" : "70",
				"AlarmActions" : [ { "Ref" : "WebServerScaleDownPolicy" } ],
				"Dimensions" : [
				{
					"Name" : "AutoScalingGroupName",
					"Value" : { "Ref" : "WebServerGroup" }
				}],
				"ComparisonOperator" : "LessThanThreshold"
			}
		},
		"sgWeb" : {
			"Type" : "AWS::EC2::SecurityGroup",
			"Properties" : {
				"GroupDescription" : "ASOH App SG Dev",
				"VpcId" : { "Ref" : "VPCID" },
				"SecurityGroupIngress" : [ 
				{
					"IpProtocol" : "tcp",
					"FromPort" : "80",
					"ToPort" : "80"
				},
				{
					"IpProtocol" : "tcp",
					"FromPort" : "80",
					"ToPort" : "80",
					"CidrIp" : "10.0.0.0/8"
				},
				{  
					"IpProtocol" : "tcp",
					"FromPort" : "80",
					"ToPort" : "8080"
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
					{ "Key" : "Name", "Value" : "sg/vpc_sysco_nonprod_02/asoh_dev_app" },
					{ "Key" : "Application_Name", "Value" : { "Ref" : "ApplicationName" } },
					{ "Key" : "Application_Id", "Value" : { "Ref" : "ApplicationId" } },
					{ "Key" : "Owner", "Value" : { "Ref" : "Owner" } },
					{ "Key" : "Approver", "Value" : { "Ref" : "Approver" } },
					{ "Key" : "Cost_Center", "Value" : { "Ref" : "PONumber" } },
					{ "Key" : "PO_Number", "Value" : { "Ref" : "PONumber" } },
					{ "Key" : "Environment", "Value" : { "Ref" : "Environment" } },
					{ "Key" : "Project_ID", "Value" : { "Ref" : "ProjectId" } }
				]
			}
		}
	}
}
