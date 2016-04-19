{
	"AWSTemplateFormatVersion" : "2010-09-09",

	"Description" : "Deployed via UOM-Catalog-POC.js that resides in Sysco source control",

	"Parameters" : {

		"ApplicationName" : {
			"Description" : "Name of application",
			"Type" : "String",
			"Default" : "UOM Catalog POC",
			"MinLength" : "1",
			"MaxLength" : "255",
			"AllowedPattern" : "[\\x20-\\x7E]*",
			"ConstraintDescription" : "Must contain only ASCII characters."
		},
		"ApplicationId" : {
			"Description" : "Application ID",
			"Type" : "String",
			"Default" : "APP-002401",
			"MinLength" : "1",
			"MaxLength" : "255",
			"AllowedPattern" : "[\\x20-\\x7E]*",
			"ConstraintDescription" : "Must contain only ASCII characters."
		},
		"PONumber" : {
			"Description" : "PO Number for billing",
			"Type" : "String",
			"Default" : "7000001648",
			"MinLength" : "1",
			"MaxLength" : "255",
			"AllowedPattern" : "[\\x20-\\x7E]*",
			"ConstraintDescription" : "Must contain only ASCII characters."
		},
		"AMIImageId" : {
			"Description": "RHEL7-BaseAMI - ami-c3aee4a6",
			"Type": "String",
			"Default": "ami-c3aee4a6",
			"AllowedPattern" : "^ami-[0-9a-fA-F]{8}",
			"ConstraintDescription" : "Must be a valid AMI."
		},
		"AMIImageId2" : {
			"Description": "20160323-RHEL-7-2-BASE - ami-6da7ab07",
			"Type": "String",
			"Default": "ami-6da7ab07",
			"AllowedPattern" : "^ami-[0-9a-fA-F]{8}",
			"ConstraintDescription" : "Must be a valid AMI."
		},
		"Approver" : {
			"Description" : "Name of application approver",
			"Type" : "String",
			"Default" : "Mike G",
			"MinLength" : "1",
			"MaxLength" : "255"
		},
		"Owner" : {
			"Description" : "Name of application owner",
			"Type" : "String",
			"Default" : "Mike G James Owen Mike Rowland",
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
		"ProjectId" : {
			"Description" : "Project ID",
			"Type" : "String",
			"Default" : "BT.001911",
			"MinLength" : "1",
			"MaxLength" : "255",
			"AllowedPattern" : "[\\x20-\\x7E]*",
			"ConstraintDescription" : "Must contain only ASCII characters."
		},
		"InstanceType" : {
			"Description" : "Application EC2 instance type",
			"Type" : "String",
			"Default" : "t2.small",
			"AllowedValues" : [
				"t2.micro",
				"t2.small",
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
		},
		"MultiAZDatabase" : {
			"Description" : "Create a multi-AZ MySQL Amazon RDS database instance",
			"Type" : "String",
			"Default" : "false",
			"AllowedValues" : [ "true", "false" ],
			"ConstraintDescription" : "must be either true or false."
		}
	},
	"Resources" : {
		"AppServerGroup" : {
			"Type" : "AWS::AutoScaling::AutoScalingGroup",
			"Properties" : {
				"AvailabilityZones" : ["us-east-1c", "us-east-1d"],
				"LaunchConfigurationName" : { "Ref" : "AppLaunchConfig" },
				"MinSize" : "1",
				"MaxSize" : "2",
				"DesiredCapacity" : "1",
				"HealthCheckType": "EC2",
				"HealthCheckGracePeriod": "300",
				"VPCZoneIdentifier" : [ { "Ref" : "SubnetIdPrivateEastC" }, { "Ref" : "SubnetIdPrivateEastD" }],
				"Tags" : [ 
					{ "Key" : "Name", "Value" : "UOM Catalog Autoscaling Group", "PropagateAtLaunch" : "true" },
					{ "Key" : "Application_Name", "Value" : { "Ref" : "ApplicationName" }, "PropagateAtLaunch" : "true" },
					{ "Key" : "Application_Id", "Value" : { "Ref" : "ApplicationId" }, "PropagateAtLaunch" : "true" },
					{ "Key" : "Owner", "Value" : { "Ref" : "Owner" }, "PropagateAtLaunch" : "true" },
					{ "Key" : "Approver", "Value" : { "Ref" : "Approver" }, "PropagateAtLaunch" : "true" },
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
		"AppLaunchConfig" : {
			"Type" : "AWS::AutoScaling::LaunchConfiguration",
			"Properties" : {
				"ImageId" : {"Ref" : "AMIImageId"},
				"InstanceType" : {"Ref" : "InstanceType"},
				"KeyName" : { "Ref" : "KeyName" },
				"SecurityGroups" : [{ "Ref" : "sgApp" }, { "Ref" : "NATaccessSG" }, { "Ref" : "CheckMKSG" }],
				"IamInstanceProfile" : { "Ref" : "InstanceProfile" },
				"UserData" : { "Fn::Base64" : { "Fn::Join" : ["", [
					"#!/bin/bash -xe\n",
					"date > /home/ec2-user/starttime\n",
					
					"#Add Users to server\n",
					"useradd -m -g aix -c \"Ezequiel Pitty, 2ndWatch Team\" zpit7073\n",
					"useradd -m -g aix -c \"James Owen, Cloud Enablement Team\" jowe6212\n",
					"useradd -m -g aix -c \"Mike Rowland, Cloud Enablement Team\" mrow7849\n",

					"# yum Updates\n",
					"yum update -y\n",
					"# yum update -y aws-cfn-bootstrap\n",

					"# Install wget\n",
					"yum install -y wget\n",
					
					"# Download and Install java\n",
					"cd /tmp\n",
					"wget --no-cookies --no-check-certificate --header \"Cookie: gpw_e24=http%3A%2F%2Fwww.oracle.com%2F; oraclelicense=accept-securebackup-cookie\" \"http://download.oracle.com/otn-pub/java/jdk/8u45-b14/jdk-8u45-linux-x64.rpm\"\n",
					"rpm -ivh jdk-8u45-linux-x64.rpm\n",
					
					"# Install smbclient\n",
					"yum install -y samba-client\n",

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
					
					"# Set Server Environment\n",
					"# sh -c \"echo 'export SERVER_ENVIRONMENT_VARIABLE=PROD' > /etc/profile.d/asoh.sh\"\n",
					"# sh -c \"echo 'export SERVER_ENVIRONMENT=PROD' >> /etc/profile.d/asoh.sh\"\n",
					
					"# Set Tomcat Environment Variable\n",
					"sh -c \"echo 'SERVER_ENVIRONMENT_VARIABLE=\"DEV\"' >> /etc/tomcat/tomcat.conf\"\n",

					"# Set Tomcat Heap Size\n",
					"sh -c \"echo 'JAVA_OPTS=\\\"-Xms512m -Xmx1536m -XX:PermSize=32m\\\"' >> /etc/tomcat/tomcat.conf\"\n",

					"# Create settings folder\n",
					"mkdir /settings\n",
					"mkdir /settings/properties\n",
					"mkdir /settings/logs\n",
					"chown tomcat -R /settings\n",
					"chgrp -R -c ec2-user /settings\n",
					"chmod -R -c 777 /settings\n",

					"# Install CodeDeploy\n",
					"yum install ruby -y\n",
					"wget https://aws-codedeploy-us-east-1.s3.amazonaws.com/latest/install\n",
					"chmod +x ./install\n",
					"./install auto\n",

					"date > /home/ec2-user/stoptime\n",
					"shutdown -r +15 \"Reboot in 15 minutes\"\n"
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
		"lx238uomcat02d" : {
			"Type" : "AWS::EC2::Instance",
			"Properties" : {
				"AvailabilityZone" : "us-east-1d",
				"ImageId" : {"Ref" : "AMIImageId2" },
				"InstanceType" : {"Ref" : "InstanceType" },
				"KeyName" : {"Ref" : "KeyName"},
				"SecurityGroupIds" : [{ "Ref" : "sgApp" }, { "Ref" : "NATaccessSG" }, { "Ref" : "CheckMKSG" }],
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
					{ "Key" : "Name", "Value" : "lx238uomcat02d" },
					{ "Key" : "Name", "Value" : "UOM Catalog Autoscaling Group" },
					{ "Key" : "Application_Name", "Value" : { "Ref" : "ApplicationName" } },
					{ "Key" : "Application_Id", "Value" : { "Ref" : "ApplicationId" } },
					{ "Key" : "Owner", "Value" : { "Ref" : "Owner" } },
					{ "Key" : "Approver", "Value" : { "Ref" : "Approver" } },
					{ "Key" : "PO_Number", "Value" : { "Ref" : "PONumber" } },
					{ "Key" : "Environment", "Value" : { "Ref" : "Environment" } },
					{ "Key" : "Project_ID", "Value" : { "Ref" : "ProjectId" } }
				],
				"UserData" : { "Fn::Base64" : { "Fn::Join" : ["", [
					"#!/bin/bash -xe\n",
					"date > /home/ec2-user/starttime\n",
					
					"#Add Users to server\n",
					"useradd -m -g aix -c \"Ezequiel Pitty, 2ndWatch Team\" zpit7073\n",
					"useradd -m -g aix -c \"James Owen, Cloud Enablement Team\" jowe6212\n",
					"useradd -m -g aix -c \"Mike Rowland, Cloud Enablement Team\" mrow7849\n",

					"# yum Updates\n",
					"# yum update -y aws-cfn-bootstrap\n",

					"# Install wget\n",
					"yum install -y wget\n",
					
					"#Change Name of server to match new hostname\n",
					"hostname lx238uomcat02d.na.sysco.net\n",
					"cat /dev/null > /etc/HOSTNAME\n",
					"echo lx238uomcat02d.na.sysco.net >> /etc/HOSTNAME","\n",
					"cat /dev/null > /etc/hostname\n",
					"echo lx238uomcat02d.na.sysco.net >> /etc/hostname","\n",

					"# Download and Install java\n",
					"cd /tmp\n",
					"wget --no-cookies --no-check-certificate --header \"Cookie: gpw_e24=http%3A%2F%2Fwww.oracle.com%2F; oraclelicense=accept-securebackup-cookie\" \"http://download.oracle.com/otn-pub/java/jdk/8u45-b14/jdk-8u45-linux-x64.rpm\"\n",
					"rpm -ivh jdk-8u45-linux-x64.rpm\n",
					
					"# Install smbclient\n",
					"yum install -y samba-client\n",

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
					
					"# Set Server Environment\n",
					"# sh -c \"echo 'export SERVER_ENVIRONMENT_VARIABLE=PROD' > /etc/profile.d/asoh.sh\"\n",
					"# sh -c \"echo 'export SERVER_ENVIRONMENT=PROD' >> /etc/profile.d/asoh.sh\"\n",
					
					"# Set Tomcat Environment Variable\n",
					"sh -c \"echo 'SERVER_ENVIRONMENT_VARIABLE=\"DEV\"' >> /etc/tomcat/tomcat.conf\"\n",

					"# Set Tomcat Heap Size\n",
					"sh -c \"echo 'JAVA_OPTS=\\\"-Xms512m -Xmx2048m -XX:PermSize=32m\\\"' >> /etc/tomcat/tomcat.conf\"\n",

					"# Create settings folder\n",
					"mkdir /settings\n",
					"mkdir /settings/properties\n",
					"mkdir /settings/logs\n",
					"chown tomcat -R /settings\n",
					"chgrp -R -c ec2-user /settings\n",
					"chmod -R -c 777 /settings\n",

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
		"sgApp" : {
			"Type" : "AWS::EC2::SecurityGroup",
			"Properties" : {
				"GroupDescription" : "UOM Catalog App SG",
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
					{ "Key" : "Name", "Value" : "sg/vpc_sysco_nonprod_02/uomcatalog_dev_app" },
					{ "Key" : "Application_Name", "Value" : { "Ref" : "ApplicationName" } },
					{ "Key" : "Application_Id", "Value" : { "Ref" : "ApplicationId" } },
					{ "Key" : "Owner", "Value" : { "Ref" : "Owner" } },
					{ "Key" : "Approver", "Value" : { "Ref" : "Approver" } },
					{ "Key" : "PO_Number", "Value" : { "Ref" : "PONumber" } },
					{ "Key" : "Environment", "Value" : { "Ref" : "Environment" } },
					{ "Key" : "Project_ID", "Value" : { "Ref" : "ProjectId" } }
				]
			}
		}
	}
}

