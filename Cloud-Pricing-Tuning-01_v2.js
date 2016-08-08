{
  "AWSTemplateFormatVersion": "2010-09-09",

  "Description": "Deployed via Cloud-Pricing-Tuning-01_v2 - New Relic Pro Agent installed on web servers as well as jar files for JVM",

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
    "stgWEBSG": {
      "Description": "Cloud Pricing Tuning Web Servers Security Group",
      "Type": "String",
      "Default": "sg-14d48271"
    },
    "TuningDBSG": {
      "Description": "DB security group",
      "Type": "String",
      "Default": "sg-ecd48289"
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
    "CommonAMI": {
      "Description": "Name of and existing VPC",
      "Type": "String",
      "Default": "ami-eed68d86"
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
      "Description" : "20160323-RHEL-7-2-BASE - ami-6da7ab07",
      "Type" : "String",
      "Default" : "ami-6da7ab07"
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
      "Default": "Karen Williams",
      "MinLength": "1",
      "MaxLength": "255"
    },
    "Owner": {
      "Description": "Name of application owner",
      "Type": "String",
      "Default": "James Owen Mike Rowland",
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
      "Default": "Tuning",
      "AllowedValues": [
        "Sandbox",
        "Development",
        "Quality",
        "Tuning",
        "Training",
        "Production"
      ],
      "ConstraintDescription": "Must be a valid environment."
    },
    "EnvironmentShort": {
      "Description": "Environment for application",
      "Type": "String",
      "Default": "STG",
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
    "WebLaunchConfig": {
      "Type": "AWS::AutoScaling::LaunchConfiguration",
      "Metadata": {
        "AWS::CloudFormation::Init": {
          "configSets": {
            "default": [ "pullScript" ]
          },
          "pullScript": {
            "files": {
              "c:\\cfn\\cfn-hup.conf": {
                "content": {
                  "Fn::Join": [
                    "",
                    [
                      "[main]\n",
                      "stack=",
                      { "Ref": "AWS::StackName" },
                      "\n",
                      "region=",
                      { "Ref": "AWS::Region" },
                      "\n"
                    ]
                  ]
                }
              },
              "c:\\cfn\\hooks.d\\cfn-auto-reloader.conf": {
                "content": {
                  "Fn::Join": [
                    "",
                    [
                      "[cfn-auto-reloader-hook]\n",
                      "triggers=post.update\n",
                      "path=Resources.WebLaunchConfig.Metadata.AWS::CloudFormation::Init\n",
                      "action=cfn-init.exe -v -s ",
                      { "Ref": "AWS::StackName" },
                      " -r WebLaunchConfig",
                      " --region ",
                      { "Ref": "AWS::Region" },
                      "\n"
                    ]
                  ]
                }
              },
              "d:\\AutomateDeployment.ps1": {
                "source": "http://ms240hudson02.na.sysco.net/jenkins-1.5.0/view/Cloud%20Pricing%20Promotion/job/CloudPricing_1.0/lastSuccessfulBuild/artifact/AMI/Deployment/AutomateDeployment.ps1"
              }
            },
            "commands": {
              "b-execute-script": {
                "command": "PowerShell.exe -ExecutionPolicy Bypass -File D:\\AutomateDeployment.ps1 WS STG 5",
                "waitAfterCompletion": "300"
              }
            }
          }
        }
      },
      "Properties": {
        "KeyName": { "Ref": "PemKey" },
        "ImageId": "ami-2e724846",
        "SecurityGroups": [ { "Ref": "stgWEBSG" } ],
        "InstanceType": "m3.large",
        "UserData": {
          "Fn::Base64": { "Fn::Join" : [ "", [
				"<script>\n",
				"cfn-init.exe -v -s ",
				{ "Ref": "AWS::StackName" },
				" -r WebLaunchConfig",
				" --region ",
				{ "Ref": "AWS::Region" },
				"\n",
				"</script>"
		  ]]}
        }
      }
    },
    "WebServerGroup": {
      "Type": "AWS::AutoScaling::AutoScalingGroup",
      "Properties": {
        "AvailabilityZones": [ "us-east-1c", "us-east-1d" ],
        "LaunchConfigurationName": { "Ref": "WebLaunchConfig" },
        "MinSize": "2",
        "MaxSize": "6",
        "DesiredCapacity": "2",
        "VPCZoneIdentifier": [
          { "Ref": "PvtSNc" },
          { "Ref": "PvtSNd" }
        ],
        "LoadBalancerNames": [ { "Ref": "stgCPELB" } ],
        "Tags": [
          { "Key" : "Name", "Value" : "CP Tuning Web Autoscale Instance", "PropagateAtLaunch" : "true" },
          { "Key" : "Application_Id", "Value" : { "Ref": "ApplicationId" }, "PropagateAtLaunch" : "true" },
          { "Key" : "Application_Name", "Value" : { "Ref": "ApplicationName" }, "PropagateAtLaunch" : "true" },
          { "Key" : "Environment", "Value" :  { "Ref": "Environment" }, "PropagateAtLaunch" : "true" },
          { "Key" : "PO_Number", "Value" : { "Ref": "PONumber" }, "PropagateAtLaunch" : "true" },
          { "Key" : "Project_ID", "Value" : { "Ref": "ProjectId" }, "PropagateAtLaunch" : "true" },
          { "Key" : "Owner", "Value" : { "Ref": "Owner" }, "PropagateAtLaunch" : "true" },
          { "Key" : "Approver", "Value" : { "Ref": "Approver" }, "PropagateAtLaunch" : "true" }
        ]
      }
    },
    "WebServerScaleUpPolicy": {
      "Type": "AWS::AutoScaling::ScalingPolicy",
      "Properties": {
        "AdjustmentType": "ChangeInCapacity",
        "AutoScalingGroupName": { "Ref": "WebServerGroup" },
        "Cooldown": "60",
        "ScalingAdjustment": "1"
      }
    },
    "WebServerScaleDownPolicy": {
      "Type": "AWS::AutoScaling::ScalingPolicy",
      "Properties": {
        "AdjustmentType": "ChangeInCapacity",
        "AutoScalingGroupName": { "Ref": "WebServerGroup" },
        "Cooldown": "60",
        "ScalingAdjustment": "-1"
      }
    },
    "CPUAlarmHigh": {
      "Type": "AWS::CloudWatch::Alarm",
      "Properties": {
        "AlarmDescription": "Scale-up if CPU > 90% for 10 minutes",
        "MetricName": "CPUUtilization",
        "Namespace": "AWS/EC2",
        "Statistic": "Average",
        "Period": "300",
        "EvaluationPeriods": "2",
        "Threshold": "90",
        "AlarmActions": [ { "Ref": "WebServerScaleUpPolicy" } ],
        "Dimensions": [
          { "Name": "AutoScalingGroupName", "Value": { "Ref": "WebServerGroup" } }
        ],
        "ComparisonOperator": "GreaterThanThreshold"
      }
    },
    "CPUAlarmLow": {
      "Type": "AWS::CloudWatch::Alarm",
      "Properties": {
        "AlarmDescription": "Scale-down if CPU < 70% for 10 minutes",
        "MetricName": "CPUUtilization",
        "Namespace": "AWS/EC2",
        "Statistic": "Average",
        "Period": "300",
        "EvaluationPeriods": "2",
        "Threshold": "70",
        "AlarmActions": [ { "Ref": "WebServerScaleDownPolicy" } ],
        "Dimensions": [
          {
            "Name": "AutoScalingGroupName",
            "Value": { "Ref": "WebServerGroup" }
          }
        ],
        "ComparisonOperator": "LessThanThreshold"
      }
    },
    "MS238CPBRFS01s": {
      "Type": "AWS::EC2::Instance",
      "Properties": {
        "DisableApiTermination": "true",
        "ImageId": "ami-470a422d",
        "IamInstanceProfile": "Sysco-ApplicationDefaultInstanceProfile-7L7ALUCW6DRW",
        "InstanceType": "m4.xlarge",
        "SecurityGroupIds": [ "sg-e151a186", "sg-ecd48289", "sg-0f7fc468", "sg-fb6c6b9e" ],
        "SubnetId": "subnet-b91a1291",
        "Tags": [
          { "Key": "Name", "Value": "MS238CPBRFS01s" },
          { "Key" : "Application_Id", "Value" : { "Ref": "ApplicationId" } },
		  { "Key" : "Application_Name", "Value" : { "Ref" : "ApplicationName" } },
          { "Key" : "Environment", "Value":  { "Ref": "Environment" } },
          { "Key" : "PO_Number", "Value" : { "Ref": "PONumber" } },
          { "Key" : "Project_ID", "Value" : { "Ref": "ProjectId" } },
          { "Key" : "Owner", "Value" : { "Ref": "Owner" } },
          { "Key" : "Approver", "Value" : { "Ref": "Approver" } }
        ],
        "UserData": {
          "Fn::Base64": {
            "Fn::Join": [
              "",
              [
                "<powershell>\n",
                "Read-S3Object -BucketName sysco-nonprod-codedeploy-us-east-1/DirectoryServices -Key SyscoDSautojoin.ps1 -File \"C:\\Program Files\\Amazon\\Ec2ConfigService\\SyscoDSautojoin.ps1\"\n",
                "& \"C:\\Program Files\\Amazon\\Ec2ConfigService\\SyscoDSautojoin.ps1\"\n",
                "</powershell>"

              ]
            ]
          }
        }

      }
    },
    "ms238cpbtsql08s": {
      "Type": "AWS::EC2::Instance",
      "Properties": {
        "AvailabilityZone": "us-east-1c",
        "DisableApiTermination": "false",
        "ImageId": { "Ref": "ODAMI" },
		"InstanceType": "m3.xlarge",
        "KeyName": { "Ref": "PemKey" },
        "SecurityGroupIds": [
          { "Ref": "TuningDBSG" },
          { "Ref": "NATaccessSG" },
          { "Ref": "CheckMKSG" }
        ],
        "SubnetId": { "Ref": "PvtSNc" },
        "Tags": [
			{ "Key": "Name", "Value" : "ms238cpbtsql08s" },
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
                "Rename-Computer -NewName ms238cpbtsql08s -Restart\n",
                "</powershell>"
              ]
            ]
          }
        }
      }
    },
    "ms238cpbtsql09s": {
      "Type": "AWS::EC2::Instance",
      "Properties": {
        "AvailabilityZone": "us-east-1d",
        "DisableApiTermination": "false",
        "ImageId": { "Ref": "ODAMI" },
		"InstanceType": "m3.xlarge",
        "KeyName": { "Ref": "PemKey" },
        "SecurityGroupIds": [
          { "Ref": "TuningDBSG" },
          { "Ref": "NATaccessSG" },
          { "Ref": "CheckMKSG" }
        ],
        "SubnetId": { "Ref": "PvtSNd" },
        "Tags": [
			{ "Key" : "Name", "Value" : "ms238cpbtsql09s" },
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
                "Rename-Computer -NewName ms238cpbtsql09s -Restart\n",
                "</powershell>"
              ]
            ]
          }
        }
      }
    },
    "ms238cpodsql08s": {
      "Type": "AWS::EC2::Instance",
      "Properties": {
        "AvailabilityZone": "us-east-1c",
        "DisableApiTermination": "false",
        "ImageId": { "Ref": "ODAMI" },
		"InstanceType": "m3.xlarge",
        "KeyName": { "Ref": "PemKey" },
        "SecurityGroupIds": [
          { "Ref": "TuningDBSG" },
          { "Ref": "NATaccessSG" },
          { "Ref": "CheckMKSG" }
        ],
        "SubnetId": { "Ref": "PvtSNc" },
        "Tags": [
			{ "Key" : "Name", "Value" : "ms238cpodsql08s" },
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
                "Rename-Computer -NewName ms238cpodsql08s -Restart\n",
                "</powershell>"
              ]
            ]
          }
        }
      }
    },
    "ms238cpodsql09s": {
      "Type": "AWS::EC2::Instance",
      "Properties": {
        "AvailabilityZone": "us-east-1d",
        "DisableApiTermination": "false",
        "ImageId": { "Ref": "ODAMI" },
		"InstanceType": "m3.xlarge",
        "KeyName": { "Ref": "PemKey" },
        "SecurityGroupIds": [
          { "Ref": "TuningDBSG" },
          { "Ref": "NATaccessSG" },
          { "Ref": "CheckMKSG" }
        ],
        "SubnetId": { "Ref": "PvtSNd" },
        "Tags": [
			{ "Key" : "Name", "Value" : "ms238cpodsql09s" },
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
                "Rename-Computer -NewName ms238cpodsql09s -Restart\n",
                "</powershell>"
              ]
            ]
          }
        }
      }
    },
	"lx238cpmcp01s" : {
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
				{ "Key" : "Name", "Value" : "lx238cpmcp01s" },
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
				"yum install -y sysstat\n",
				
				"# Set Timezone\n",
				"timedatectl set-timezone UTC\n",

				"#Change Name of server to match new hostname\n",
				"hostname lx238cpmcp01s.na.sysco.net\n",
				"echo lx238cpmcp01s.na.sysco.net > /etc/hostname","\n",
				"# sh -c \"hostname  cpmcp-$(curl http://169.254.169.254/latest/meta-data/local-ipv4/ -s)s.na.sysco.net\"\n",
				"#sh -c \"echo  cpmcp-$(curl http://169.254.169.254/latest/meta-data/local-ipv4/ -s)s.na.sysco.net\" > /etc/hostname\n",
				"#Add Users to server\n",
				"useradd -m -g aix -c \"James Owen, Cloud Enablement Team\" jowe6212\n",
				"useradd -m -g aix -c \"Mike Rowland, Enterprise Architect\" mrow7849\n",
				"useradd -m -g aix -c \"Fernando Nieto, App Dev\" fnie6886\n",
				"useradd -m -g aix -c \"Ravi Goli, App Dev\" rgol4427\n",

				"# Download and Install java\n",
				"cd /tmp\n",
				"wget --no-cookies --no-check-certificate --header \"Cookie: gpw_e24=http%3A%2F%2Fwww.oracle.com%2F; oraclelicense=accept-securebackup-cookie\" \"http://download.oracle.com/otn-pub/java/jdk/8u45-b14/jdk-8u45-linux-x64.rpm\"\n",
				"rpm -ivh jdk-8u45-linux-x64.rpm\n",

				"# Install tomcat\n",
				"groupadd tomcat\n",
				"useradd tomcat -b /app -g tomcat -e \"\"\n",
				"cd /tmp\n",
				"wget http://archive.apache.org/dist/tomcat/tomcat-7/v7.0.68/bin/apache-tomcat-7.0.68.tar.gz\n",
				"tar xzf apache-tomcat-7.0.68.tar.gz\n",
				"mv apache-tomcat-7.0.68 /usr/local/tomcat7\n",

				"# Install smbclient\n",
				"yum install -y samba-client\n",

				"# Set Server Environment\n",
				"sh -c \"echo 'export SERVER_ENVIRONMENT_VARIABLE=", { "Ref" : "EnvironmentShort" }, "'\" > /etc/profile.d/cpmcp.sh\n",
				"# sh -c \"echo 'export SERVER_ENVIRONMENT=STG' >> /etc/profile.d/cpmcp.sh\"\n",
				
				"# Set Tomcat Environment Variable\n",
				"# sh -c \"echo 'SERVER_ENVIRONMENT_VARIABLE=\"", { "Ref" : "EnvironmentShort" }, "\"'\" >> /usr/local/tomcat7/conf/tomcat.conf\n",

				"# Set Tomcat Set JVM Heap\n",
				"# sh -c \"echo 'JAVA_OPTS=\"-Xms1g -Xmx1g -XX:MaxPermSize=256m\"'\" >> /usr/local/tomcat7/conf/tomcat.conf\n",

				"# Start Tomcat\n",
				"# /usr/local/tomcat7/bin/startup.sh\n",

				"# Create settings folder\n",
				"mkdir /settings\n",
				"mkdir /settings/properties\n",
				"mkdir /settings/logs\n",
				"chown tomcat -R /settings\n",
				"chgrp -R -c ec2-user /settings\n",
				"chmod -R -c 777 /settings\n",

				"# Install Splunk Universal Forwarder\n",
				"cd /tmp\n",
				"wget -O splunkforwarder-6.4.1-debde650d26e-linux-2.6-x86_64.rpm 'https://www.splunk.com/bin/splunk/DownloadActivityServlet?architecture=x86_64&platform=linux&version=6.4.1&product=universalforwarder&filename=splunkforwarder-6.4.1-debde650d26e-linux-2.6-x86_64.rpm&wget=true'\n",
				"chmod 744 splunkforwarder-6.4.1-debde650d26e-linux-2.6-x86_64.rpm\n",
				"rpm -i splunkforwarder-6.4.1-debde650d26e-linux-2.6-x86_64.rpm\n",
				"cd /opt/splunkforwarder\n",
				"./bin/splunk start --accept-license\n",
				"./bin/splunk enable boot-start\n",
				"./bin/splunk restart\n",

				"# Configure to run as a deployment client\n",
				"./bin/splunk set deploy-poll internal-SyscoSplunkDployProdELB-prod-1536191272.us-east-1.elb.amazonaws.com:8089 -auth admin:changeme\n",

				"# Configure forwarder to send logs to Splunk Indexer\n",
				"./bin/splunk add forward-server internal-SyscoSplunkIndxProdELB-prod-124146806.us-east-1.elb.amazonaws.com:9997 -auth admin:changeme\n",
				"./bin/splunk restart\n",

				"# Install CodeDeploy\n",
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
				{ "Key" : "Name", "Value" : "lx238cpjp01s", "PropagateAtLaunch" : "true" },
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
				"yum install -y sysstat\n",
				
				"# Set Timezone\n",
				"timedatectl set-timezone UTC\n",

				"#Change Name of server to match new hostname\n",
				"hostname lx238cpjp01s.na.sysco.net\n",
				"echo lx238cpjp01s.na.sysco.net > /etc/hostname","\n",
				"# sh -c \"hostname  cpjp-$(curl http://169.254.169.254/latest/meta-data/local-ipv4/ -s)s.na.sysco.net\"\n",
				"#sh -c \"echo  cpjp-$(curl http://169.254.169.254/latest/meta-data/local-ipv4/ -s)s.na.sysco.net\" > /etc/hostname\n",

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
				"wget --no-cookies --no-check-certificate --header \"Cookie: gpw_e24=http%3A%2F%2Fwww.oracle.com%2F; oraclelicense=accept-securebackup-cookie\" \"http://download.oracle.com/otn-pub/java/jdk/8u45-b14/jdk-8u45-linux-x64.rpm\"\n",
				"rpm -ivh jdk-8u45-linux-x64.rpm\n",

				"# Install smbclient\n",
				"yum install -y samba-client\n",

				"# Set Server Environment\n",
				"sh -c \"echo 'export SERVER_ENVIRONMENT_VARIABLE=", { "Ref" : "EnvironmentShort" }, "'\" > /etc/profile.d/cpjp.sh\n",
				"# sh -c \"echo 'export SERVER_ENVIRONMENT=STG' >> /etc/profile.d/cpjp.sh\"\n",
				
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
				"wget -O splunkforwarder-6.4.1-debde650d26e-linux-2.6-x86_64.rpm 'https://www.splunk.com/bin/splunk/DownloadActivityServlet?architecture=x86_64&platform=linux&version=6.4.1&product=universalforwarder&filename=splunkforwarder-6.4.1-debde650d26e-linux-2.6-x86_64.rpm&wget=true'\n",
				"chmod 744 splunkforwarder-6.4.1-debde650d26e-linux-2.6-x86_64.rpm\n",
				"rpm -i splunkforwarder-6.4.1-debde650d26e-linux-2.6-x86_64.rpm\n",
				"cd /opt/splunkforwarder\n",
				"./bin/splunk start --accept-license\n",
				"./bin/splunk enable boot-start\n",

				"# Configure to run as a deployment client\n",
				"./bin/splunk set deploy-poll splunkdeploy.na.sysco.net:8089 -auth admin:changeme\n",

				"# Configure forwarder to send logs to Splunk Indexer\n",
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
				{ "Key" : "Name", "Value" : "sg/vpc_sysco_stg_01/cpmcp_stg_app" },
				{ "Key" : "Application_Name", "Value" : { "Ref" : "ApplicationName" } },
				{ "Key" : "Application_Id", "Value" : { "Ref" : "ApplicationId" } },
				{ "Key" : "Owner", "Value" : { "Ref" : "Owner" } },
				{ "Key" : "Approver", "Value" : { "Ref" : "Approver" } },
				{ "Key" : "PO_Number", "Value" : { "Ref" : "PONumber" } },
				{ "Key" : "Environment", "Value" : { "Ref" : "Environment" } },
				{ "Key" : "Project_ID", "Value" : { "Ref" : "ProjectId" } }
			]
		}
	},
	"CPDBClusterSTG" : {
		"Type" : "AWS::RDS::DBCluster",
		"DeletionPolicy" : "Snapshot",
		"Properties" : {
			"DatabaseName" : "CPDB_Common01s",
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
			"DBInstanceIdentifier" : "CPDBMasterSTG",
			"AllowMajorVersionUpgrade" : "true",
			"DBClusterIdentifier" : { "Ref" : "CPDBClusterSTG" },
			"DBInstanceClass" : "db.r3.xlarge",
			"Engine" : "aurora",
			"DBSubnetGroupName" : { "Ref" : "snDB" },
			"Tags" : [
				{ "Key" : "Name", "Value" : "Cloud Pricing Common Database Primary" },
				{ "Key" : "Application_Name", "Value" : { "Ref" : "ApplicationName" } },
				{ "Key" : "Application_Id", "Value" : { "Ref" : "ApplicationId" } },
				{ "Key" : "Owner", "Value" : { "Ref" : "Owner" } },
				{ "Key" : "Approver", "Value" : { "Ref" : "Approver" } },
				{ "Key" : "PO_Number", "Value" : { "Ref" : "PONumber" } },
				{ "Key" : "Environment", "Value" : { "Ref" : "Environment" } },
				{ "Key" : "Project_ID", "Value" : { "Ref" : "ProjectId" } }
			]
		}
	},
	"DBCommonReplica01" : {
		"Type" : "AWS::RDS::DBInstance",
		"DependsOn": "DBCommonPrimary",
		"Properties" :  {
			"DBInstanceIdentifier" : "CPDBReplica01STG",
			"AllowMajorVersionUpgrade" : "true",
			"DBClusterIdentifier" : { "Ref" : "CPDBClusterSTG" },
			"DBInstanceClass" : "db.r3.xlarge",
			"Engine" : "aurora",
			"DBSubnetGroupName" : { "Ref" : "snDB" },
			"Tags" : [
				{ "Key" : "Name", "Value" : "Cloud Pricing Common Database Replica01" },
				{ "Key" : "Application_Name", "Value" : { "Ref" : "ApplicationName" } },
				{ "Key" : "Application_Id", "Value" : { "Ref" : "ApplicationId" } },
				{ "Key" : "Owner", "Value" : { "Ref" : "Owner" } },
				{ "Key" : "Approver", "Value" : { "Ref" : "Approver" } },
				{ "Key" : "PO_Number", "Value" : { "Ref" : "PONumber" } },
				{ "Key" : "Environment", "Value" : { "Ref" : "Environment" } },
				{ "Key" : "Project_ID", "Value" : { "Ref" : "ProjectId" } }
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
				{ "Key" : "Name", "Value" : "sg/vpc_sysco_stg_01/swmsmobile_stg_db" },
				{ "Key" : "Application_Name", "Value" : { "Ref" : "ApplicationName" } },
				{ "Key" : "Application_Id", "Value" : { "Ref" : "ApplicationId" } },
				{ "Key" : "Owner", "Value" : { "Ref" : "Owner" } },
				{ "Key" : "Approver", "Value" : { "Ref" : "Approver" } },
				{ "Key" : "PO_Number", "Value" : { "Ref" : "PONumber" } },
				{ "Key" : "Environment", "Value" : { "Ref" : "Environment" } },
				{ "Key" : "Project_ID", "Value" : { "Ref" : "ProjectId" } }
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
				{ "Key" : "Owner", "Value" : { "Ref" : "Owner" } },
				{ "Key" : "Approver", "Value" : { "Ref" : "Approver" } },
				{ "Key" : "PO_Number", "Value" : { "Ref" : "PONumber" } },
				{ "Key" : "Environment", "Value" : { "Ref" : "Environment" } },
				{ "Key" : "Project_ID", "Value" : { "Ref" : "ProjectId" } }
			]
		}
	},
    "stgCPELB": {
      "Type": "AWS::ElasticLoadBalancing::LoadBalancer",
      "Properties": {
        "Subnets": [
          { "Ref": "PvtSNc" },
          { "Ref": "PvtSNd" }
        ],
        "LoadBalancerName": "elb-ws01-cp-tuning",
        "Scheme": "internal",
        "CrossZone": "true",
        "SecurityGroups": [ { "Ref": "stgWEBSG" } ],
        "Listeners": [
          {
            "LoadBalancerPort": "80",
            "InstancePort": "80",
            "Protocol": "HTTP"
          },
          {
            "LoadBalancerPort": "443",
            "InstancePort": "443",
            "Protocol": "TCP"
          }
        ],
        "HealthCheck": {
          "Target": "HTTP:80/pricerequest/healthcheck",
          "HealthyThreshold": "3",
          "UnhealthyThreshold": "2",
          "Interval": "30",
          "Timeout": "5"
        },
        "Tags": [
          { "Key": "Name", "Value": "elb_ws01/vpc_sysco_nonprod_02/cp_web_tuning" },
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
	"MS238CPUPSQL01s": {
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
						"path=Resources.MS238CPUPSQL01s.Metadata.AWS::CloudFormation::Init\n",
						"action=cfn-init.exe -v -s ", { "Ref" : "AWS::StackId" }, " -r MS238CPUPSQL01s --region ", { "Ref" : "AWS::Region" }, "\n"
					]]}},
					"C:\\temp\\apache-tomcat-7.0.70-windows-x64.zip" :
						{ "source" : "http://archive.apache.org/dist/tomcat/tomcat-7/v7.0.70/bin/apache-tomcat-7.0.70-windows-x64.zip" },
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

						"powershell.exe -nologo -noprofile -command \"& { Add-Type -A 'System.IO.Compression.FileSystem'; [IO.Compression.ZipFile]::ExtractToDirectory('apache-tomcat-7.0.70-windows-x64.zip', 'C:\\Program Files\\Tomcat\\'); }\"\n",

						"aws s3 cp s3://sysco-nonprod-codedeploy-us-east-1/CloudPricing_UpdateService/", { "Ref" : "EnvironmentShort" }, "/properties/CreateTask.xml C:\\temp\\CreateTask.xml\n",
						"%windir%/System32/schtasks /Create /F /tn \"Cloud Pricing - Startup Task\" /xml C:\\temp\\CreateTask.xml\n"
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
			"AvailabilityZone": "us-east-1d",
			"DisableApiTermination": "false",
			"ImageId": { "Ref" : "AMIUpdateProc" },
			"InstanceType": "c4.large",
			"IamInstanceProfile" : { "Ref" : "InstanceProfileUpdateServer" },
			"KeyName": { "Ref": "PemKey2" },
			"SecurityGroupIds": [ { "Ref": "TuningDBSG" }, { "Ref" : "NATaccessSG" }, { "Ref" : "CheckMKSG" } ],
			"SubnetId": { "Ref": "PvtSNd" },
			"Tags": [
				{ "Key": "Name", "Value": "MS238CPUPSQL01s" },
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
				"cfn-init.exe -v -s ", { "Ref" : "AWS::StackId" }, " -r MS238CPUPSQL01s --region ", { "Ref" : "AWS::Region" }, "\n",
				"</script>"
			]]}}
		}
	},
	"MS238CPUPSQL02s": {
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
						"path=Resources.MS238CPUPSQL02s.Metadata.AWS::CloudFormation::Init\n",
						"action=cfn-init.exe -v -s ", { "Ref" : "AWS::StackId" }, " -r MS238CPUPSQL02s --region ", { "Ref" : "AWS::Region" }, "\n"
					]]}},
					"C:\\temp\\apache-tomcat-7.0.70-windows-x64.zip" :
						{ "source" : "http://archive.apache.org/dist/tomcat/tomcat-7/v7.0.70/bin/apache-tomcat-7.0.70-windows-x64.zip" },
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

						"powershell.exe -nologo -noprofile -command \"& { Add-Type -A 'System.IO.Compression.FileSystem'; [IO.Compression.ZipFile]::ExtractToDirectory('apache-tomcat-7.0.70-windows-x64.zip', 'C:\\Program Files\\Tomcat\\'); }\"\n",

						"aws s3 cp s3://sysco-nonprod-codedeploy-us-east-1/CloudPricing_UpdateService/", { "Ref" : "EnvironmentShort" }, "/properties/CreateTask.xml C:\\temp\\CreateTask.xml\n",
						"%windir%/System32/schtasks /Create /F /tn \"Cloud Pricing - Startup Task\" /xml C:\\temp\\CreateTask.xml\n"
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
			"AvailabilityZone": "us-east-1d",
			"DisableApiTermination": "false",
			"ImageId": { "Ref" : "AMIUpdateProc" },
			"InstanceType": "c4.large",
			"IamInstanceProfile" : { "Ref" : "InstanceProfileUpdateServer" },
			"KeyName": { "Ref": "PemKey2" },
			"SecurityGroupIds": [ { "Ref": "TuningDBSG" }, { "Ref" : "NATaccessSG" }, { "Ref" : "CheckMKSG" } ],
			"SubnetId": { "Ref": "PvtSNd" },
			"Tags": [
				{ "Key": "Name", "Value": "MS238CPUPSQL02s" },
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
				"cfn-init.exe -v -s ", { "Ref" : "AWS::StackId" }, " -r MS238CPUPSQL02s --region ", { "Ref" : "AWS::Region" }, "\n",
				"</script>"
			]]}}
		}
	}
  },
  "Outputs" : {
	"dbUrl" : {
		"Description" : "Endpoint for Common DB",
		"Value" : { "Fn::Join" : ["", [{ "Fn::GetAtt" : [ "CPDBClusterSTG", "Endpoint.Address" ]}]] }
	}
  }
}
