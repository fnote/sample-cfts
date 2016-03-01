{
	"AWSTemplateFormatVersion" : "2010-09-09",

	"Description" : "Deployed via ASOH-Prod.js that resides in Sysco source control",

	"Parameters" : {

		"ApplicationName" : {
			"Description" : "Name of application",
			"Type" : "String",
			"Default" : "ASOH Prod",
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
			"Description" : "BASE-TOMCAT-RHEL7 - ami-270f334d",
			"Type" : "String",
			"Default" : "ami-270f334d",
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
			"Default" : "Production",
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
			"Default" : "prod",
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
		"DnsAppName" : {
			"Description" : "Name of application",
			"Type" : "String",
			"Default" : "asoh",
			"MinLength" : "1",
			"MaxLength" : "16",
			"AllowedPattern" : "[\\x20-\\x7E]*",
			"ConstraintDescription" : "Must contain only ASCII characters."
		},
		"HostedZone" : {
			"Description" : "The DNS name of an existing Amazon Route 53 hosted zone",
			"Type" : "String",
			"Default" : "vpc.na.sysco.net",
			"AllowedValues" : [
				"vpc.na.sysco.net",
				"cloud.sysco.com"
			],
			"ConstraintDescription" : "Must be a valid DNS Record in Route53."
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
			"Description" : "vpc_sysco_prod_01 CIDR: 10.168.144.0/20",
			"Type" : "AWS::EC2::VPC::Id",
			"Default" : "vpc-99e855fc",
			"ConstraintDescription" : "Must be a valid VPC."
		},
		"NATaccessSG" : {
			"Description" : "NAT access Security Group",
			"Type" : "String",
			"Default" : "sg-1803c47f",
			"ConstraintDescription" : "Must be a valid NAT Security Group."
		},
		"CheckMKSG" : {
			"Description" : "NAT access Security Group",
			"Type" : "String",
			"Default" : "sg-42dc8b26",
			"ConstraintDescription" : "Must be a valid NAT Security Group."
		},
		"KeyName" : {
			"Description" : "Name of an existing KeyPair",
			"Type" : "AWS::EC2::KeyPair::KeyName",
			"Default" : "KeyPair-Sysco-ASOH_Prod",
			"MinLength" : "1",
			"MaxLength" : "255",
			"AllowedPattern" : "[\\x20-\\x7E]*",
			"ConstraintDescription" : "Must contain only ASCII characters."
		},
		"SubnetIdPrivateEastC" : {
			"Description" : "Private subnet for confidential apps in us-east-1c CIDR: 10.168.154.0/23",
			"Type" : "AWS::EC2::Subnet::Id",
			"Default" : "subnet-1ec25b69",
			"MinLength" : "1",
			"MaxLength" : "255",
			"ConstraintDescription" : "Must be a valid Private Subnet."
		},
		"SubnetIdPrivateEastD" : {
			"Description" : "Private subnet for confidential apps in us-east-1d CIDR: 10.168.156.0/23",
			"Type" : "AWS::EC2::Subnet::Id",
			"Default" : "subnet-db7bc582",
			"MinLength" : "1",
			"MaxLength" : "255",
			"ConstraintDescription" : "Must be a valid Private Subnet."
		},
		"SubnetIdPrivateEastE" : {
			"Description" : "Private subnet for confidential apps in us-east-1e CIDR: 10.168.158.0/23",
			"Type" : "AWS::EC2::Subnet::Id",
			"Default" : "subnet-a421629e",
			"MinLength" : "1",
			"MaxLength" : "255",
			"ConstraintDescription" : "Must be a valid Private Subnet."
		},
		"SubnetIdPublicEastC" : {
			"Description" : "Public subnet for the ELB in us-east-1c CIDR: 10.168.151.0/24",
			"Type" : "AWS::EC2::Subnet::Id",
			"Default" : "subnet-1fc25b68",
			"MinLength" : "1",
			"MaxLength" : "255",
			"ConstraintDescription" : "Must be a valid Public Subnet."
		},
		"SubnetIdPublicEastD" : {
			"Description" : "Public subnet for the ELB in us-east-1d CIDR: 10.168.152.0/24",
			"Type" : "AWS::EC2::Subnet::Id",
			"Default" : "subnet-dd7bc584",
			"MinLength" : "1",
			"MaxLength" : "255",
			"ConstraintDescription" : "Must be a valid Public Subnet."
		},
		"sgELBPrivate" : {
			"Description" : "Private ELB Security Group",
			"Type" : "String",
			"Default" : "sg-21a19d46"
		},
		"InstanceProfile" : {
			"Description" : "Instance Profile Name",
			"Type" : "String",
			"Default" : "Sysco-ApplicationDefaultInstanceProfile-47RRMF15XFMP"
		},
		"RootVolumeSize" : {
			"Description" : "Size (GB) of root EBS volume for application instance",
			"Type" : "Number",
			"Default" : "60",
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
				"UserData" : { "Fn::Base64" : { "Fn::Join" : ["", [
					"#!/bin/bash -v\n",
					"yum update -y\n",
					"yum update -y aws-cfn-bootstrap\n",
					"date > /home/ec2-user/starttime\n",
					"yum update -y wget\n",
					"yum update -y curl\n",

					"#Change Name of server to match new hostname\n",
					"hostname lx238asohws01.na.sysco.net\n",
					"cat /dev/null > /etc/HOSTNAME\n",
					"echo lx238asohws01.na.sysco.net >> /etc/HOSTNAME","\n",
					"cat /dev/null > /etc/hostname\n",
					"echo lx238asohws01.na.sysco.net >> /etc/hostname","\n",
					"#Add Users to server\n",
					"useradd -m -g aix -c \"Ezequiel Pitty, 2ndWatch Team\" zpit7073\n",
					"useradd -m -g aix -c \"James Owen, Cloud Enablement Team\" jowe6212\n",
					"useradd -m -g aix -c \"Mike Rowland, Enterprise Architect\" mrow7849\n",
					"useradd -m -g aix -c \"Ravi Goli, App Dev\" rgol4427\n",

					"# Install smbclient\n",
					"yum install -y samba-client\n",

					"# Set Server Environment\n",
					"# sh -c \"echo 'export SERVER_ENVIRONMENT_VARIABLE=PROD' > /etc/profile.d/asoh.sh\"\n",
					"# sh -c \"echo 'export SERVER_ENVIRONMENT=PROD' >> /etc/profile.d/asoh.sh\"\n",
					
					"# Set Tomcat Environment Variable\n",
					"sh -c \"echo 'SERVER_ENVIRONMENT_VARIABLE=\"PROD\"' >> /etc/tomcat/tomcat.conf\"\n",

					"# Create settings folder\n",
					"mkdir /settings\n",
					"mkdir /settings/properties\n",
					"mkdir /settings/logs\n",
					"chown tomcat -R /settings\n",
					"chgrp -R -c ec2-user /settings\n",
					"chmod -R -c 777 /settings\n",

					"# Start tomcat\n",
					"service tomcat start\n",

					"# Install CodeDeploy\n",
					"yum install ruby -y\n",
					"wget https://aws-codedeploy-us-east-1.s3.amazonaws.com/latest/install\n",
					"chmod +x ./install\n",
					"./install auto\n",

					"date > /home/ec2-user/stoptime\n"
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
		"RegionRecord" : {
				"Type" : "AWS::Route53::RecordSet",
				"Properties" : {
				"HostedZoneName" : { "Fn::Join" : [ "", [{"Ref" : "HostedZone"}, "." ]]},
				"Comment" : "DNS name for my instance.",
				"Name" : { "Fn::Join" : ["", [{ "Ref" : "DnsAppName" }, ".", {"Ref" : "HostedZone"}, "." ]] },
				"Type" : "CNAME",
				"TTL" : "900",
				"ResourceRecords" : [ { "Fn::GetAtt" : [ "elbWeb", "DNSName" ] } ]
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
					"S3BucketName": "sysco-prod-log",
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
					{ "Key" : "Name", "Value" : "sg/vpc_sysco_prod_01/asoh_prod_app" },
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
		},
		"Route53DNSName" : {
			"Description" : "Route 53 URL",
			"Value" : { "Fn::Join" : ["", ["http://", { "Ref" : "DnsAppName" }, ".", {"Ref" : "HostedZone"}, "." ]] }
		}
	}
}
