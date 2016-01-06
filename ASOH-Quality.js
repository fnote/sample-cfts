{
	"AWSTemplateFormatVersion" : "2010-09-09",

	"Description" : "Deployed via ASOH-Quality.js that resides in Sysco source control",

	"Parameters" : {

		"ApplicationName" : {
			"Description" : "Name of application",
			"Type" : "String",
			"Default" : "ASOH Quality",
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
		"Owner" : {
			"Description" : "Name of application owner",
			"Type" : "String",
			"Default" : "James Owen",
			"MinLength" : "1",
			"MaxLength" : "255"
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
		"Approver" : {
			"Description" : "Name of application approver",
			"Type" : "String",
			"Default" : "Samir Patel James Owen",
			"MinLength" : "1",
			"MaxLength" : "255"
		},
		"Environment" : {
			"Description" : "Environment for application",
			"Type" : "String",
			"Default" : "Quality",
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
			"Default" : "qa",
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
		"ProjectId" : {
			"Description" : "Project ID",
			"Type" : "String",
			"Default" : "BT.001176",
			"MinLength" : "1",
			"MaxLength" : "255",
			"AllowedPattern" : "[\\x20-\\x7E]*",
			"ConstraintDescription" : "Must contain only ASCII characters."
		},
		"AMIImageId" : {
			"Description" : "RHEL-7.1_HVM_GA-20150225-x86_64-1-Hourly2-GP2 - ami-12663b7a",
			"Type" : "String",
			"Default" : "ami-12663b7a",
			"AllowedPattern" : "^ami-[0-9a-fA-F]{8}",
			"ConstraintDescription" : "Must be a valid AMI."
		},
		"AMIWebServer": {
			"Description": "ASOH App AMI V1.00",
			"Type": "String",
			"Default": "ami-104c127a"
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
		"sgELBPrivate" : {
			"Description" : "Private ELB Security Group",
			"Type" : "String",
			"Default" : "sg-00054a67"
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
				"MinSize" : "2",
				"MaxSize" : "4",
				"DesiredCapacity" : "2",
				"HealthCheckType": "ELB",
				"HealthCheckGracePeriod": "1200",
				"VPCZoneIdentifier" : [ { "Ref" : "SubnetIdPrivateEastC" }, { "Ref" : "SubnetIdPrivateEastD" }],
				"LoadBalancerNames" : [ { "Ref" : "elbWeb" } ],
				"Tags" : [ 
					{ "Key" : "Name", "Value" : "ASOH Web Autoscaling Group", "PropagateAtLaunch" : "true" },
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
				"ImageId" : {"Ref" : "AMIWebServer"},
				"InstanceType" : {"Ref" : "InstanceType"},
				"KeyName" : { "Ref" : "KeyName" },
				"SecurityGroups" : [{ "Ref" : "sgWeb" }, { "Ref" : "NATaccessSG" }, { "Ref" : "CheckMKSG" }],
				"IamInstanceProfile" : { "Ref" : "InstanceProfile" },
				"UserData" : { "Fn::Base64" : { "Fn::Join" : ["", [
					"#!/bin/bash -xe\n",
					
					"# Start ASOH Application\n",
					"java -Dserver.port=8080 -jar /home/ec2-user/apps/asohws.18.jar > app.18.log &\n"
					
					
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
		"elbWeb" : {
			"Type" : "AWS::ElasticLoadBalancing::LoadBalancer",
			"Properties" : {
				"SecurityGroups" : [{ "Ref" : "sgELBPrivate" }],
				"Subnets" : [{ "Ref" : "SubnetIdPrivateEastC" },{ "Ref" : "SubnetIdPrivateEastD" }],
				"Scheme" : "internal",
				"LoadBalancerName" : { "Fn::Join" : ["", ["elb-wb01-asoh-", { "Ref" : "EnvironmentShort" }]]},
				"Listeners" : [
				{
					"LoadBalancerPort" : "80",
					"InstancePort" :  "8080" ,
					"Protocol" : "HTTP"
				}],
				"AccessLoggingPolicy": {
					"EmitInterval": "60",
					"Enabled": "True",
					"S3BucketName": "sysco-logs",
					"S3BucketPrefix": "ELB"
				},
				"HealthCheck" : {
					"Target" : "HTTP:8080/",
					"HealthyThreshold" : "3",
					"UnhealthyThreshold" : "2",
					"Interval" : "30",
					"Timeout" : "5"
				},
				"Tags" : [
					{ "Key" : "Name", "Value" : "ASOH Mobile App ELB" },
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
		},
		"sgWeb" : {
			"Type" : "AWS::EC2::SecurityGroup",
			"Properties" : {
				"GroupDescription" : "ASOH App SG",
				"VpcId" : { "Ref" : "VPCID" },
				"SecurityGroupIngress" : [ 
				{
					"IpProtocol" : "tcp",
					"FromPort" : "80",
					"ToPort" : "80",
					"SourceSecurityGroupId" : {"Ref":"sgELBPrivate"}
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
					"ToPort" : "8080",
					"SourceSecurityGroupId" : {"Ref":"sgELBPrivate"}
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
					{ "Key" : "Name", "Value" : "sg/vpc_sysco_nonprod_02/asoh_qa_app" },
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
	},
	"Outputs" : {
		"elbWebUrl" : {
			"Description" : "URL for Web ELB",
			"Value" : { "Fn::Join" : ["", ["http://", { "Fn::GetAtt" : [ "elbWeb", "DNSName" ]}]] }
		}	}
}
