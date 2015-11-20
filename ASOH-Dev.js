{
	"AWSTemplateFormatVersion" : "2010-09-09",

	"Description" : "Deployed via ASOH-Dev.js that resides in Sysco source control",

	"Parameters" : {

		"ApplicationName" : {
			"Description" : "Name of application",
			"Type" : "String",
			"Default" : "ASOH",
			"MinLength" : "1",
			"MaxLength" : "255",
			"AllowedPattern" : "[\\x20-\\x7E]*",
			"ConstraintDescription" : "Must contain only ASCII characters."
		},
		"ApplicationId" : {
			"Description" : "Application ID",
			"Type" : "String",
			"Default" : "APP-000000",
			"MinLength" : "1",
			"MaxLength" : "255",
			"AllowedPattern" : "[\\x20-\\x7E]*",
			"ConstraintDescription" : "Must contain only ASCII characters."
		},
		"Owner" : {
			"Description" : "Name of application owner",
			"Type" : "String",
			"Default" : "James Owen",
			"MinLength" : "1",
			"MaxLength" : "255"
		},
		"CostCenter" : {
			"Description" : "PO Number for billing",
			"Type" : "String",
			"Default" : "7000000725",
			"MinLength" : "1",
			"MaxLength" : "255",
			"AllowedPattern" : "[\\x20-\\x7E]*",
			"ConstraintDescription" : "Must contain only ASCII characters."
		},
		"Approver" : {
			"Description" : "Name of application approver",
			"Type" : "String",
			"Default" : "Samir Patel",
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
			"Default" : "dev",
			"AllowedValues" : [
				"sbx",
				"dev",
				"qa",
				"stg",
				"trn",
				"prod"
			],
			"ConstraintDescription" : "Must be a valid environment."
		},
		"SecurityClassification" : {
			"Description" : "Security Classification for application",
			"Type" : "String",
			"Default" : "Confidential",
			"AllowedValues" : [
				"Very Sensitive",
				"Confidential",
				"Public"
			],
			"ConstraintDescription" : "Must be a valid Security Classification."
		},
		"SupportCriticality" : {
			"Description" : "Importance for support response times.",
			"Type" : "String",
			"Default" : "Low",
			"AllowedValues" : [
				"None",
				"Low",
				"Medium",
				"High",
				"Critical"
			],
			"ConstraintDescription" : "Must be a valid support type."
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
			"Default" : "50",
			"MinValue" : "10",
			"MaxValue" : "1024"
		},
		"AMIImageId" : {
			"Description" : "Name of an existing AMI ID to build from, example ami-1643ff72",
			"Type" : "String",
			"Default" : "ami-12663b7a",
			"AllowedPattern" : "^ami-[0-9a-fA-F]{8}",
			"ConstraintDescription" : "Must be a valid AMI."
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
				"MaxSize" : "1",
				"DesiredCapacity" : "1",
				"HealthCheckType": "EC2",
				"HealthCheckGracePeriod": "1200",
				"VPCZoneIdentifier" : [ { "Ref" : "SubnetIdPrivateEastC" }, { "Ref" : "SubnetIdPrivateEastD" }],
				"Tags" : [ 
					{ "Key" : "Name", "Value" : "ASOH Web Autoscaling Group", "PropagateAtLaunch" : "true" },
					{ "Key" : "Application_Name", "Value" : { "Ref" : "ApplicationName" }, "PropagateAtLaunch" : "true" },
					{ "Key" : "Application_Id", "Value" : { "Ref" : "ApplicationId" }, "PropagateAtLaunch" : "true" },
					{ "Key" : "Owner", "Value" : { "Ref" : "Owner" }, "PropagateAtLaunch" : "true" },
					{ "Key" : "Approver", "Value" : { "Ref" : "Approver" }, "PropagateAtLaunch" : "true" },
					{ "Key" : "Cost_Center", "Value" : { "Ref" : "CostCenter" }, "PropagateAtLaunch" : "true" },
					{ "Key" : "Environment", "Value" : { "Ref" : "Environment" }, "PropagateAtLaunch" : "true" },
					{ "Key" : "Security_Classification", "Value" : { "Ref" : "SecurityClassification" }, "PropagateAtLaunch" : "true" },
					{ "Key" : "System_Type", "Value" : "Web Server", "PropagateAtLaunch" : "true" },
					{ "Key" : "Support_Criticality", "Value" : { "Ref" : "SupportCriticality" }, "PropagateAtLaunch" : "true" }
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
				"UserData" : { "Fn::Base64" : { "Fn::Join" : ["", [
					"#!/bin/bash -xe\n",
					"yum update -y aws-cfn-bootstrap\n",
					
					"# Install java\n",
					"yum install -y java-1.7.0-openjdk.x86_64\n",
					"export JAVA_HOME=\"/usr/lib/jvm/java-1.7.0-openjdk-1.7.0.85-2.6.1.2.el7_1.x86_64/jre\"\n",

					"# Install apache\n",
					"yum install -y httpd.x86_64\n",
					"yum install -y httpd-devel.x86_64\n",
					"yum install -y httpd-manual.noarch\n",
					"yum install -y httpd-tools.x86_64\n",

					"groupadd www\n",
					"usermod -a -G www ec2-user\n",
					"chown -R root:www /var/www\n",
					"chmod 2775 /var/www\n",
					"find /var/www -type d -exec chmod 2775 {} +\n",
					"find /var/www -type f -exec chmod 0664 {} +\n"
				]]}},
				"BlockDeviceMappings" : [
				  {
					"DeviceName" : "/dev/sda1",
					"Ebs" : {
						"VolumeSize" : { "Ref" : "RootVolumeSize" },
						"VolumeType" : "gp2"
					}
				  }
				]
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
				"GroupDescription" : "SWMS Mobile App SG",
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
					{ "Key" : "Name", "Value" : "sg/vpc_sysco_prod_01/swmsmobile_prod_app" },
					{ "Key" : "Application_Name", "Value" : { "Ref" : "ApplicationName" } },
					{ "Key" : "Application_Id", "Value" : { "Ref" : "ApplicationId" } },
					{ "Key" : "Owner", "Value" : { "Ref" : "Owner" } },
					{ "Key" : "Approver", "Value" : { "Ref" : "Approver" } },
					{ "Key" : "Cost_Center", "Value" : { "Ref" : "CostCenter" } },
					{ "Key" : "Environment", "Value" : { "Ref" : "Environment" } },
					{ "Key" : "Security_Classification", "Value" : { "Ref" : "SecurityClassification" } },
					{ "Key" : "System_Type", "Value" : "Networking" },
					{ "Key" : "Support_Criticality", "Value" : { "Ref" : "SupportCriticality" } }
				]
			}
		}
	}
}
