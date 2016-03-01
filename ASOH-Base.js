{
	"AWSTemplateFormatVersion" : "2010-09-09",

	"Description" : "Deployed via ASOH-Prod4.js that resides in Sysco source control",

	"Parameters" : {

		"ApplicationName" : {
			"Description" : "Name of application",
			"Type" : "String",
			"Default" : "ASOHT Prod",
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
			"Description" : "RHEL7-BaseAMI - ami-c3aee4a6",
			"Type" : "String",
			"Default" : "ami-c3aee4a6",
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
		"lx238asohws01" : {
			"Type" : "AWS::EC2::Instance",
			"Properties" : {
				"AvailabilityZone" : "us-east-1d",
				"ImageId" : {"Ref" : "AMIImageId"},
				"InstanceType" : {"Ref" : "InstanceType" },
				"KeyName" : { "Ref" : "KeyName" },
				"SecurityGroupIds" : [{ "Ref" : "sgWeb" }, { "Ref" : "NATaccessSG" }, { "Ref" : "CheckMKSG" }],
				"IamInstanceProfile" : { "Ref" : "InstanceProfile" },
				"SubnetId" : {"Ref" : "SubnetIdPrivateEastD"},
				"BlockDeviceMappings" : [ {
					"DeviceName" : "/dev/sda1",
					"Ebs" : {
						"VolumeSize" : { "Ref" : "RootVolumeSize" },
						"VolumeType" : "gp2"
					}
				} ],
				"Tags" : [ 
					{ "Key" : "Name", "Value" : "lx238asohws01" },
					{ "Key" : "Application_Name", "Value" : { "Ref" : "ApplicationName" } },
					{ "Key" : "Application_Id", "Value" : { "Ref" : "ApplicationId" } },
					{ "Key" : "Owner", "Value" : { "Ref" : "Owner" } },
					{ "Key" : "Approver", "Value" : { "Ref" : "Approver" } },
					{ "Key" : "Cost_Center", "Value" : { "Ref" : "PONumber" } },
					{ "Key" : "PO_Number", "Value" : { "Ref" : "PONumber" } },
					{ "Key" : "Environment", "Value" : { "Ref" : "Environment" } },
					{ "Key" : "Project_ID", "Value" : { "Ref" : "ProjectId" } }
				],
				"UserData" : { "Fn::Base64" : { "Fn::Join" : ["", [
					"#!/bin/bash -v\n",
					"yum update -y\n",
					"yum update -y aws-cfn-bootstrap\n",
					"yum install -y wget\n",
					"yum install -y curl\n",

					"# Download and Install java\n",
					"cd /tmp\n",
					"wget --no-cookies --no-check-certificate --header \"Cookie: gpw_e24=http%3A%2F%2Fwww.oracle.com%2F; oraclelicense=accept-securebackup-cookie\" \"http://download.oracle.com/otn-pub/java/jdk/8u45-b14/jdk-8u45-linux-x64.rpm\"\n",
					"rpm -ivh jdk-8u45-linux-x64.rpm\n",

					"# Install tomcat\n",
					"yum install -y tomcat.noarch\n",
					"yum install -y tomcat-admin-webapps.noarch\n",
					"yum install -y tomcat-el-2.2-api.noarch\n",
					"yum install -y tomcat-jsp-2.2-api.noarch\n",
					"yum install -y tomcat-lib.noarch\n",
					"yum install -y tomcat-servlet-3.0-api.noarch\n",
					"yum install -y tomcat-webapps.noarch\n",
					"yum install -y tomcatjss.noarch\n",
					"service tomcat start\n",

					"shutdown -r +15 \"Reboot in 15 minutes\"\n",
					"date > /home/ec2-user/stoptime\n"
					]]}
				}
			}
		},
		"sgWeb" : {
			"Type" : "AWS::EC2::SecurityGroup",
			"Properties" : {
				"GroupDescription" : "ASOHT App SG",
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
					{ "Key" : "Name", "Value" : "sg/vpc_sysco_prod_01/asoht_prod_app" },
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
