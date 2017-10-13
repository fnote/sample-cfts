{
	"AWSTemplateFormatVersion": "2010-09-09",
	"Description": "Deployed via Cloud-Pricing-Prod-02.js",
	"Parameters": {
		"PONumber": {
			"Description": "PO Number for billing",
			"Type": "String",
			"Default": "7000002358",
			"MinLength": "1",
			"MaxLength": "255",
			"AllowedPattern": "[\\x20-\\x7E]*",
			"ConstraintDescription": "Must contain only ASCII characters."
		},
		"Conf1c": {
			"Description": "Confidential us-east-1c subnet",
			"Type": "String",
			"Default": "subnet-1ec25b69"
		},
		"Conf1d": {
			"Description": "Confidential us-east-1d subnet",
			"Type": "String",
			"Default": "subnet-db7bc582"
		},
		"Conf1e": {
			"Description": "Confidential us-east-1e subnet",
			"Type": "String",
			"Default": "subnet-a421629e"
		},
		"VPCID": {
			"Description": "Name of and existing VPC",
			"Type": "String",
			"Default": "vpc-99e855fc"
		},
		"NATCLIENT": {
			"Description": "nat client sg",
			"Type": "String",
			"Default": "sg-1803c47f"
		},
		"CheckMKSG": {
			"Description": "NAT access Security Group",
			"Type": "String",
			"Default": "sg-42dc8b26",
			"ConstraintDescription": "Must be a valid NAT Security Group."
		},
		"SQL2016AMI": {
			"Description": "Microsoft Windows Server 2016 with SQL Server Standard - ami-c2e5ebd4",
			"Type": "String",
			"Default": "ami-c2e5ebd4"
		},
		"CPOD006AMI": {
			"Description": "CP-OnDemand-006 - ami-7102270a",
			"Type": "String",
			"Default": "ami-7102270a"
		},
		"CPOD010AMI": {
			"Description": "CP-OnDemand-010 - ami-11e7c86a",
			"Type": "String",
			"Default": "ami-11e7c86a"
		},
		"CPUP014AMI": {
			"Description": "CP-UpdateProcessor-014 - ami-95173fee",
			"Type": "String",
			"Default": "ami-95173fee"
		},
		"PemKey": {
			"Description": "Name of and existing EC2 KeyPair to enable SSH access to the instance",
			"Type": "String",
			"Default": "KeyPair-Sysco-CI-Management"
		},
		"PemKey2": {
			"Description": "Name of and existing EC2 KeyPair to enable SSH access to the instance",
			"Type": "String",
			"Default": "KeyPair-Sysco-CloudPricing-Prod"
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
			"Default": "Production",
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
			"Default": "PROD",
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
		"MS238CPBRFS01": {
			"Type": "AWS::EC2::Instance",
			"Properties": {
				"DisableApiTermination": "true",
				"ImageId": "ami-470a422d",
				"IamInstanceProfile": "Sysco-ApplicationDefaultInstanceProfile-47RRMF15XFMP",
				"InstanceType": "m4.xlarge",
				"SecurityGroupIds": [{
					"Ref": "CPDBSG"
				}, {
					"Ref": "NATCLIENT"
				}, "sg-42dc8b26"],
				"SubnetId": {
					"Ref": "Conf1e"
				},
				"Tags": [
				  { "Key" : "Name", "Value": "MS238CPBRFS01" },
				  { "Key" : "Application_Id", "Value" : { "Ref": "ApplicationId" } },
				  { "Key" : "Application_Name", "Value" : { "Ref": "ApplicationName" } },
				  { "Key" : "Environment", "Value" :  { "Ref": "Environment" } },
				  { "Key" : "PO_Number", "Value" : { "Ref": "PONumber" } },
				  { "Key" : "Project_ID", "Value" : { "Ref": "ProjectId" } },
				  { "Key" : "Owner", "Value" : { "Ref": "Owner" } },
				  { "Key" : "Approver", "Value" : { "Ref": "Approver" } }
				],
				"UserData": {
					"Fn::Base64": {
						"Fn::Join": [
							"", [
								"<powershell>\n",
								"Read-S3Object -BucketName sysco-prod-codedeploy-us-east-1/DirectoryServices -Key SyscoDSautojoin.ps1 -File \"C:\\Program Files\\Amazon\\Ec2ConfigService\\SyscoDSautojoin.ps1\"\n",
								"& \"C:\\Program Files\\Amazon\\Ec2ConfigService\\SyscoDSautojoin.ps1\"\n",
								"</powershell>"

							]
						]
					}
				}

			}
		},
		"ms238cpodsql001": {
			"Type": "AWS::EC2::Instance",
			"Properties": {
				"AvailabilityZone": "us-east-1c",
				"IamInstanceProfile": "Sysco-ApplicationDefaultInstanceProfile-47RRMF15XFMP",
				"ImageId": { "Ref": "CPOD010AMI" },
				"InstanceType": "m4.large",
				"KeyName": { "Ref": "PemKey2" },
				"SecurityGroupIds": [{ "Ref": "CPDBSG" }, { "Ref": "NATCLIENT" }, "sg-42dc8b26"],
				"SubnetId": { "Ref": "Conf1c" },
				"BlockDeviceMappings": [
					{"DeviceName": "/dev/sda1", "Ebs": { "VolumeSize": "50", "VolumeType": "gp2" }},
					{"DeviceName": "xvdb", "Ebs": { "VolumeSize": "1", "VolumeType": "gp2" }},
					{"DeviceName": "xvdc", "Ebs": { "VolumeSize": "1", "VolumeType": "gp2" }},
					{"DeviceName": "xvdd", "Ebs": { "VolumeSize": "1", "VolumeType": "gp2" }},
					{"DeviceName": "xvde", "Ebs": { "VolumeSize": "150", "VolumeType": "gp2" }},
					{"DeviceName": "xvdf", "Ebs": { "VolumeSize": "150", "VolumeType": "gp2" }}
				],
				"Tags": [
				  { "Key" : "Name", "Value": "ms238cpodsql001" },
				  { "Key" : "Application_Id", "Value" : { "Ref": "ApplicationId" } },
				  { "Key" : "Application_Name", "Value" : { "Ref": "ApplicationName" } },
				  { "Key" : "Environment", "Value" :  { "Ref": "Environment" } },
				  { "Key" : "PO_Number", "Value" : { "Ref": "PONumber" } },
				  { "Key" : "Project_ID", "Value" : { "Ref": "ProjectId" } },
				  { "Key" : "Owner", "Value" : { "Ref": "Owner" } },
				  { "Key" : "Approver", "Value" : { "Ref": "Approver" } }
				],
				"UserData": {
					"Fn::Base64": { "Fn::Join": [ "", [
						"<powershell>\n",
						"Rename-Computer -NewName ms238cpodsql001 -Restart\n",
						"</powershell>"
					]]}
				}
			}
		},
		"ms238cpodsql002": {
			"Type": "AWS::EC2::Instance",
			"Properties": {
				"AvailabilityZone": "us-east-1d",
				"IamInstanceProfile": "Sysco-ApplicationDefaultInstanceProfile-47RRMF15XFMP",
				"ImageId": { "Ref": "CPOD010AMI" },
				"InstanceType": "m4.large",
				"KeyName": { "Ref": "PemKey2" },
				"SecurityGroupIds": [{ "Ref": "CPDBSG" }, { "Ref": "NATCLIENT" }, "sg-42dc8b26"],
				"SubnetId": { "Ref": "Conf1d" },
				"BlockDeviceMappings": [
					{"DeviceName": "/dev/sda1", "Ebs": { "VolumeSize": "50", "VolumeType": "gp2" }},
					{"DeviceName": "xvdb", "Ebs": { "VolumeSize": "1", "VolumeType": "gp2" }},
					{"DeviceName": "xvdc", "Ebs": { "VolumeSize": "1", "VolumeType": "gp2" }},
					{"DeviceName": "xvdd", "Ebs": { "VolumeSize": "1", "VolumeType": "gp2" }},
					{"DeviceName": "xvde", "Ebs": { "VolumeSize": "150", "VolumeType": "gp2" }},
					{"DeviceName": "xvdf", "Ebs": { "VolumeSize": "150", "VolumeType": "gp2" }}
				],
				"Tags": [
				  { "Key" : "Name", "Value": "ms238cpodsql002" },
				  { "Key" : "Application_Id", "Value" : { "Ref": "ApplicationId" } },
				  { "Key" : "Application_Name", "Value" : { "Ref": "ApplicationName" } },
				  { "Key" : "Environment", "Value" :  { "Ref": "Environment" } },
				  { "Key" : "PO_Number", "Value" : { "Ref": "PONumber" } },
				  { "Key" : "Project_ID", "Value" : { "Ref": "ProjectId" } },
				  { "Key" : "Owner", "Value" : { "Ref": "Owner" } },
				  { "Key" : "Approver", "Value" : { "Ref": "Approver" } }
				],
				"UserData": {
					"Fn::Base64": { "Fn::Join": [ "", [
						"<powershell>\n",
						"Rename-Computer -NewName ms238cpodsql002 -Restart\n",
						"</powershell>"
					]]}
				}
			}
		},
		"ms238cpodsql003": {
			"Type": "AWS::EC2::Instance",
			"Properties": {
				"AvailabilityZone": "us-east-1c",
				"IamInstanceProfile": "Sysco-ApplicationDefaultInstanceProfile-47RRMF15XFMP",
				"ImageId": { "Ref": "CPOD010AMI" },
				"InstanceType": "m4.large",
				"KeyName": { "Ref": "PemKey2" },
				"SecurityGroupIds": [{ "Ref": "CPDBSG" }, { "Ref": "NATCLIENT" }, "sg-42dc8b26"],
				"SubnetId": { "Ref": "Conf1c" },
				"BlockDeviceMappings": [
					{"DeviceName": "/dev/sda1", "Ebs": { "VolumeSize": "50", "VolumeType": "gp2" }},
					{"DeviceName": "xvdb", "Ebs": { "VolumeSize": "1", "VolumeType": "gp2" }},
					{"DeviceName": "xvdc", "Ebs": { "VolumeSize": "1", "VolumeType": "gp2" }},
					{"DeviceName": "xvdd", "Ebs": { "VolumeSize": "1", "VolumeType": "gp2" }},
					{"DeviceName": "xvde", "Ebs": { "VolumeSize": "150", "VolumeType": "gp2" }},
					{"DeviceName": "xvdf", "Ebs": { "VolumeSize": "150", "VolumeType": "gp2" }}
				],
				"Tags": [
				  { "Key" : "Name", "Value": "ms238cpodsql003" },
				  { "Key" : "Application_Id", "Value" : { "Ref": "ApplicationId" } },
				  { "Key" : "Application_Name", "Value" : { "Ref": "ApplicationName" } },
				  { "Key" : "Environment", "Value" :  { "Ref": "Environment" } },
				  { "Key" : "PO_Number", "Value" : { "Ref": "PONumber" } },
				  { "Key" : "Project_ID", "Value" : { "Ref": "ProjectId" } },
				  { "Key" : "Owner", "Value" : { "Ref": "Owner" } },
				  { "Key" : "Approver", "Value" : { "Ref": "Approver" } }
				],
				"UserData": {
					"Fn::Base64": { "Fn::Join": [ "", [
						"<powershell>\n",
						"Rename-Computer -NewName ms238cpodsql003 -Restart\n",
						"</powershell>"
					]]}
				}
			}
		},
		"ms238cpodsql004": {
			"Type": "AWS::EC2::Instance",
			"Properties": {
				"AvailabilityZone": "us-east-1d",
				"IamInstanceProfile": "Sysco-ApplicationDefaultInstanceProfile-47RRMF15XFMP",
				"ImageId": { "Ref": "CPOD010AMI" },
				"InstanceType": "m4.large",
				"KeyName": { "Ref": "PemKey2" },
				"SecurityGroupIds": [{ "Ref": "CPDBSG" }, { "Ref": "NATCLIENT" }, "sg-42dc8b26"],
				"SubnetId": { "Ref": "Conf1d" },
				"BlockDeviceMappings": [
					{"DeviceName": "/dev/sda1", "Ebs": { "VolumeSize": "50", "VolumeType": "gp2" }},
					{"DeviceName": "xvdb", "Ebs": { "VolumeSize": "1", "VolumeType": "gp2" }},
					{"DeviceName": "xvdc", "Ebs": { "VolumeSize": "1", "VolumeType": "gp2" }},
					{"DeviceName": "xvdd", "Ebs": { "VolumeSize": "1", "VolumeType": "gp2" }},
					{"DeviceName": "xvde", "Ebs": { "VolumeSize": "150", "VolumeType": "gp2" }},
					{"DeviceName": "xvdf", "Ebs": { "VolumeSize": "150", "VolumeType": "gp2" }}
				],
				"Tags": [
				  { "Key" : "Name", "Value": "ms238cpodsql004" },
				  { "Key" : "Application_Id", "Value" : { "Ref": "ApplicationId" } },
				  { "Key" : "Application_Name", "Value" : { "Ref": "ApplicationName" } },
				  { "Key" : "Environment", "Value" :  { "Ref": "Environment" } },
				  { "Key" : "PO_Number", "Value" : { "Ref": "PONumber" } },
				  { "Key" : "Project_ID", "Value" : { "Ref": "ProjectId" } },
				  { "Key" : "Owner", "Value" : { "Ref": "Owner" } },
				  { "Key" : "Approver", "Value" : { "Ref": "Approver" } }
				],
				"UserData": {
					"Fn::Base64": { "Fn::Join": [ "", [
						"<powershell>\n",
						"Rename-Computer -NewName ms238cpodsql004 -Restart\n",
						"</powershell>"
					]]}
				}
			}
		},
		"ms238cpodsql005": {
			"Type": "AWS::EC2::Instance",
			"Properties": {
				"AvailabilityZone": "us-east-1c",
				"IamInstanceProfile": "Sysco-ApplicationDefaultInstanceProfile-47RRMF15XFMP",
				"ImageId": { "Ref": "CPOD010AMI" },
				"InstanceType": "m4.large",
				"KeyName": { "Ref": "PemKey2" },
				"SecurityGroupIds": [{ "Ref": "CPDBSG" }, { "Ref": "NATCLIENT" }, "sg-42dc8b26"],
				"SubnetId": { "Ref": "Conf1c" },
				"BlockDeviceMappings": [
					{"DeviceName": "/dev/sda1", "Ebs": { "VolumeSize": "50", "VolumeType": "gp2" }},
					{"DeviceName": "xvdb", "Ebs": { "VolumeSize": "1", "VolumeType": "gp2" }},
					{"DeviceName": "xvdc", "Ebs": { "VolumeSize": "1", "VolumeType": "gp2" }},
					{"DeviceName": "xvdd", "Ebs": { "VolumeSize": "1", "VolumeType": "gp2" }},
					{"DeviceName": "xvde", "Ebs": { "VolumeSize": "150", "VolumeType": "gp2" }},
					{"DeviceName": "xvdf", "Ebs": { "VolumeSize": "150", "VolumeType": "gp2" }}
				],
				"Tags": [
				  { "Key" : "Name", "Value": "ms238cpodsql005" },
				  { "Key" : "Application_Id", "Value" : { "Ref": "ApplicationId" } },
				  { "Key" : "Application_Name", "Value" : { "Ref": "ApplicationName" } },
				  { "Key" : "Environment", "Value" :  { "Ref": "Environment" } },
				  { "Key" : "PO_Number", "Value" : { "Ref": "PONumber" } },
				  { "Key" : "Project_ID", "Value" : { "Ref": "ProjectId" } },
				  { "Key" : "Owner", "Value" : { "Ref": "Owner" } },
				  { "Key" : "Approver", "Value" : { "Ref": "Approver" } }
				],
				"UserData": {
					"Fn::Base64": { "Fn::Join": [ "", [
						"<powershell>\n",
						"Rename-Computer -NewName ms238cpodsql005 -Restart\n",
						"</powershell>"
					]]}
				}
			}
		},
		"ms238cpodsql006": {
			"Type": "AWS::EC2::Instance",
			"Properties": {
				"AvailabilityZone": "us-east-1d",
				"IamInstanceProfile": "Sysco-ApplicationDefaultInstanceProfile-47RRMF15XFMP",
				"ImageId": { "Ref": "CPOD010AMI" },
				"InstanceType": "m4.large",
				"KeyName": { "Ref": "PemKey2" },
				"SecurityGroupIds": [{ "Ref": "CPDBSG" }, { "Ref": "NATCLIENT" }, "sg-42dc8b26"],
				"SubnetId": { "Ref": "Conf1d" },
				"BlockDeviceMappings": [
					{"DeviceName": "/dev/sda1", "Ebs": { "VolumeSize": "50", "VolumeType": "gp2" }},
					{"DeviceName": "xvdb", "Ebs": { "VolumeSize": "1", "VolumeType": "gp2" }},
					{"DeviceName": "xvdc", "Ebs": { "VolumeSize": "1", "VolumeType": "gp2" }},
					{"DeviceName": "xvdd", "Ebs": { "VolumeSize": "1", "VolumeType": "gp2" }},
					{"DeviceName": "xvde", "Ebs": { "VolumeSize": "150", "VolumeType": "gp2" }},
					{"DeviceName": "xvdf", "Ebs": { "VolumeSize": "150", "VolumeType": "gp2" }}
				],
				"Tags": [
				  { "Key" : "Name", "Value": "ms238cpodsql006" },
				  { "Key" : "Application_Id", "Value" : { "Ref": "ApplicationId" } },
				  { "Key" : "Application_Name", "Value" : { "Ref": "ApplicationName" } },
				  { "Key" : "Environment", "Value" :  { "Ref": "Environment" } },
				  { "Key" : "PO_Number", "Value" : { "Ref": "PONumber" } },
				  { "Key" : "Project_ID", "Value" : { "Ref": "ProjectId" } },
				  { "Key" : "Owner", "Value" : { "Ref": "Owner" } },
				  { "Key" : "Approver", "Value" : { "Ref": "Approver" } }
				],
				"UserData": {
					"Fn::Base64": { "Fn::Join": [ "", [
						"<powershell>\n",
						"Rename-Computer -NewName ms238cpodsql006 -Restart\n",
						"</powershell>"
					]]}
				}
			}
		},
		"ms238cpodsql007": {
			"Type": "AWS::EC2::Instance",
			"Properties": {
				"AvailabilityZone": "us-east-1c",
				"IamInstanceProfile": "Sysco-ApplicationDefaultInstanceProfile-47RRMF15XFMP",
				"ImageId": { "Ref": "CPOD010AMI" },
				"InstanceType": "m4.large",
				"KeyName": { "Ref": "PemKey2" },
				"SecurityGroupIds": [{ "Ref": "CPDBSG" }, { "Ref": "NATCLIENT" }, "sg-42dc8b26"],
				"SubnetId": { "Ref": "Conf1c" },
				"BlockDeviceMappings": [
					{"DeviceName": "/dev/sda1", "Ebs": { "VolumeSize": "50", "VolumeType": "gp2" }},
					{"DeviceName": "xvdb", "Ebs": { "VolumeSize": "1", "VolumeType": "gp2" }},
					{"DeviceName": "xvdc", "Ebs": { "VolumeSize": "1", "VolumeType": "gp2" }},
					{"DeviceName": "xvdd", "Ebs": { "VolumeSize": "1", "VolumeType": "gp2" }},
					{"DeviceName": "xvde", "Ebs": { "VolumeSize": "150", "VolumeType": "gp2" }},
					{"DeviceName": "xvdf", "Ebs": { "VolumeSize": "150", "VolumeType": "gp2" }}
				],
				"Tags": [
				  { "Key" : "Name", "Value": "ms238cpodsql007" },
				  { "Key" : "Application_Id", "Value" : { "Ref": "ApplicationId" } },
				  { "Key" : "Application_Name", "Value" : { "Ref": "ApplicationName" } },
				  { "Key" : "Environment", "Value" :  { "Ref": "Environment" } },
				  { "Key" : "PO_Number", "Value" : { "Ref": "PONumber" } },
				  { "Key" : "Project_ID", "Value" : { "Ref": "ProjectId" } },
				  { "Key" : "Owner", "Value" : { "Ref": "Owner" } },
				  { "Key" : "Approver", "Value" : { "Ref": "Approver" } }
				],
				"UserData": {
					"Fn::Base64": { "Fn::Join": [ "", [
						"<powershell>\n",
						"Rename-Computer -NewName ms238cpodsql007 -Restart\n",
						"</powershell>"
					]]}
				}
			}
		},
		"ms238cpodsql008": {
			"Type": "AWS::EC2::Instance",
			"Properties": {
				"AvailabilityZone": "us-east-1d",
				"IamInstanceProfile": "Sysco-ApplicationDefaultInstanceProfile-47RRMF15XFMP",
				"ImageId": { "Ref": "CPOD010AMI" },
				"InstanceType": "m4.large",
				"KeyName": { "Ref": "PemKey2" },
				"SecurityGroupIds": [{ "Ref": "CPDBSG" }, { "Ref": "NATCLIENT" }, "sg-42dc8b26"],
				"SubnetId": { "Ref": "Conf1d" },
				"BlockDeviceMappings": [
					{"DeviceName": "/dev/sda1", "Ebs": { "VolumeSize": "50", "VolumeType": "gp2" }},
					{"DeviceName": "xvdb", "Ebs": { "VolumeSize": "1", "VolumeType": "gp2" }},
					{"DeviceName": "xvdc", "Ebs": { "VolumeSize": "1", "VolumeType": "gp2" }},
					{"DeviceName": "xvdd", "Ebs": { "VolumeSize": "1", "VolumeType": "gp2" }},
					{"DeviceName": "xvde", "Ebs": { "VolumeSize": "150", "VolumeType": "gp2" }},
					{"DeviceName": "xvdf", "Ebs": { "VolumeSize": "150", "VolumeType": "gp2" }}
				],
				"Tags": [
				  { "Key" : "Name", "Value": "ms238cpodsql008" },
				  { "Key" : "Application_Id", "Value" : { "Ref": "ApplicationId" } },
				  { "Key" : "Application_Name", "Value" : { "Ref": "ApplicationName" } },
				  { "Key" : "Environment", "Value" :  { "Ref": "Environment" } },
				  { "Key" : "PO_Number", "Value" : { "Ref": "PONumber" } },
				  { "Key" : "Project_ID", "Value" : { "Ref": "ProjectId" } },
				  { "Key" : "Owner", "Value" : { "Ref": "Owner" } },
				  { "Key" : "Approver", "Value" : { "Ref": "Approver" } }
				],
				"UserData": {
					"Fn::Base64": { "Fn::Join": [ "", [
						"<powershell>\n",
						"Rename-Computer -NewName ms238cpodsql008 -Restart\n",
						"</powershell>"
					]]}
				}
			}
		},
		"ms238cpodsql071": {
			"Type": "AWS::EC2::Instance",
			"Properties": {
				"AvailabilityZone": "us-east-1c",
				"IamInstanceProfile": "Sysco-ApplicationDefaultInstanceProfile-47RRMF15XFMP",
				"ImageId": { "Ref": "CPOD010AMI" },
				"InstanceType": "m4.large",
				"KeyName": { "Ref": "PemKey2" },
				"SecurityGroupIds": [{ "Ref": "CPDBSG" }, { "Ref": "NATCLIENT" }, "sg-42dc8b26"],
				"SubnetId": { "Ref": "Conf1c" },
				"BlockDeviceMappings": [
					{"DeviceName": "/dev/sda1", "Ebs": { "VolumeSize": "50", "VolumeType": "gp2" }},
					{"DeviceName": "xvdb", "Ebs": { "VolumeSize": "1", "VolumeType": "gp2" }},
					{"DeviceName": "xvdc", "Ebs": { "VolumeSize": "1", "VolumeType": "gp2" }},
					{"DeviceName": "xvdd", "Ebs": { "VolumeSize": "1", "VolumeType": "gp2" }},
					{"DeviceName": "xvde", "Ebs": { "VolumeSize": "150", "VolumeType": "gp2" }},
					{"DeviceName": "xvdf", "Ebs": { "VolumeSize": "150", "VolumeType": "gp2" }}
				],
				"Tags": [
				  { "Key" : "Name", "Value": "ms238cpodsql071" },
				  { "Key" : "Application_Id", "Value" : { "Ref": "ApplicationId" } },
				  { "Key" : "Application_Name", "Value" : { "Ref": "ApplicationName" } },
				  { "Key" : "Environment", "Value" :  { "Ref": "Environment" } },
				  { "Key" : "PO_Number", "Value" : { "Ref": "PONumber" } },
				  { "Key" : "Project_ID", "Value" : { "Ref": "ProjectId" } },
				  { "Key" : "Owner", "Value" : { "Ref": "Owner" } },
				  { "Key" : "Approver", "Value" : { "Ref": "Approver" } }
				],
				"UserData": {
					"Fn::Base64": { "Fn::Join": [ "", [
						"<powershell>\n",
						"Rename-Computer -NewName ms238cpodsql071 -Restart\n",
						"</powershell>"
					]]}
				}
			}
		},
		"ms238cpodsql072": {
			"Type": "AWS::EC2::Instance",
			"Properties": {
				"AvailabilityZone": "us-east-1d",
				"IamInstanceProfile": "Sysco-ApplicationDefaultInstanceProfile-47RRMF15XFMP",
				"ImageId": { "Ref": "CPOD010AMI" },
				"InstanceType": "m4.large",
				"KeyName": { "Ref": "PemKey2" },
				"SecurityGroupIds": [{ "Ref": "CPDBSG" }, { "Ref": "NATCLIENT" }, "sg-42dc8b26"],
				"SubnetId": { "Ref": "Conf1d" },
				"BlockDeviceMappings": [
					{"DeviceName": "/dev/sda1", "Ebs": { "VolumeSize": "50", "VolumeType": "gp2" }},
					{"DeviceName": "xvdb", "Ebs": { "VolumeSize": "1", "VolumeType": "gp2" }},
					{"DeviceName": "xvdc", "Ebs": { "VolumeSize": "1", "VolumeType": "gp2" }},
					{"DeviceName": "xvdd", "Ebs": { "VolumeSize": "1", "VolumeType": "gp2" }},
					{"DeviceName": "xvde", "Ebs": { "VolumeSize": "150", "VolumeType": "gp2" }},
					{"DeviceName": "xvdf", "Ebs": { "VolumeSize": "150", "VolumeType": "gp2" }}
				],
				"Tags": [
				  { "Key" : "Name", "Value": "ms238cpodsql072" },
				  { "Key" : "Application_Id", "Value" : { "Ref": "ApplicationId" } },
				  { "Key" : "Application_Name", "Value" : { "Ref": "ApplicationName" } },
				  { "Key" : "Environment", "Value" :  { "Ref": "Environment" } },
				  { "Key" : "PO_Number", "Value" : { "Ref": "PONumber" } },
				  { "Key" : "Project_ID", "Value" : { "Ref": "ProjectId" } },
				  { "Key" : "Owner", "Value" : { "Ref": "Owner" } },
				  { "Key" : "Approver", "Value" : { "Ref": "Approver" } }
				],
				"UserData": {
					"Fn::Base64": { "Fn::Join": [ "", [
						"<powershell>\n",
						"Rename-Computer -NewName ms238cpodsql072 -Restart\n",
						"</powershell>"
					]]}
				}
			}
		},
		"ms238cpodsql073": {
			"Type": "AWS::EC2::Instance",
			"Properties": {
				"AvailabilityZone": "us-east-1c",
				"IamInstanceProfile": "Sysco-ApplicationDefaultInstanceProfile-47RRMF15XFMP",
				"ImageId": { "Ref": "CPOD010AMI" },
				"InstanceType": "m4.large",
				"KeyName": { "Ref": "PemKey2" },
				"SecurityGroupIds": [{ "Ref": "CPDBSG" }, { "Ref": "NATCLIENT" }, "sg-42dc8b26"],
				"SubnetId": { "Ref": "Conf1c" },
				"BlockDeviceMappings": [
					{"DeviceName": "/dev/sda1", "Ebs": { "VolumeSize": "50", "VolumeType": "gp2" }},
					{"DeviceName": "xvdb", "Ebs": { "VolumeSize": "1", "VolumeType": "gp2" }},
					{"DeviceName": "xvdc", "Ebs": { "VolumeSize": "1", "VolumeType": "gp2" }},
					{"DeviceName": "xvdd", "Ebs": { "VolumeSize": "1", "VolumeType": "gp2" }},
					{"DeviceName": "xvde", "Ebs": { "VolumeSize": "150", "VolumeType": "gp2" }},
					{"DeviceName": "xvdf", "Ebs": { "VolumeSize": "150", "VolumeType": "gp2" }}
				],
				"Tags": [
				  { "Key" : "Name", "Value": "ms238cpodsql073" },
				  { "Key" : "Application_Id", "Value" : { "Ref": "ApplicationId" } },
				  { "Key" : "Application_Name", "Value" : { "Ref": "ApplicationName" } },
				  { "Key" : "Environment", "Value" :  { "Ref": "Environment" } },
				  { "Key" : "PO_Number", "Value" : { "Ref": "PONumber" } },
				  { "Key" : "Project_ID", "Value" : { "Ref": "ProjectId" } },
				  { "Key" : "Owner", "Value" : { "Ref": "Owner" } },
				  { "Key" : "Approver", "Value" : { "Ref": "Approver" } }
				],
				"UserData": {
					"Fn::Base64": { "Fn::Join": [ "", [
						"<powershell>\n",
						"Rename-Computer -NewName ms238cpodsql073 -Restart\n",
						"</powershell>"
					]]}
				}
			}
		},
		"ms238cpodsql074": {
			"Type": "AWS::EC2::Instance",
			"Properties": {
				"AvailabilityZone": "us-east-1d",
				"IamInstanceProfile": "Sysco-ApplicationDefaultInstanceProfile-47RRMF15XFMP",
				"ImageId": { "Ref": "CPOD010AMI" },
				"InstanceType": "m4.large",
				"KeyName": { "Ref": "PemKey2" },
				"SecurityGroupIds": [{ "Ref": "CPDBSG" }, { "Ref": "NATCLIENT" }, "sg-42dc8b26"],
				"SubnetId": { "Ref": "Conf1d" },
				"BlockDeviceMappings": [
					{"DeviceName": "/dev/sda1", "Ebs": { "VolumeSize": "50", "VolumeType": "gp2" }},
					{"DeviceName": "xvdb", "Ebs": { "VolumeSize": "1", "VolumeType": "gp2" }},
					{"DeviceName": "xvdc", "Ebs": { "VolumeSize": "1", "VolumeType": "gp2" }},
					{"DeviceName": "xvdd", "Ebs": { "VolumeSize": "1", "VolumeType": "gp2" }},
					{"DeviceName": "xvde", "Ebs": { "VolumeSize": "150", "VolumeType": "gp2" }},
					{"DeviceName": "xvdf", "Ebs": { "VolumeSize": "150", "VolumeType": "gp2" }}
				],
				"Tags": [
				  { "Key" : "Name", "Value": "ms238cpodsql074" },
				  { "Key" : "Application_Id", "Value" : { "Ref": "ApplicationId" } },
				  { "Key" : "Application_Name", "Value" : { "Ref": "ApplicationName" } },
				  { "Key" : "Environment", "Value" :  { "Ref": "Environment" } },
				  { "Key" : "PO_Number", "Value" : { "Ref": "PONumber" } },
				  { "Key" : "Project_ID", "Value" : { "Ref": "ProjectId" } },
				  { "Key" : "Owner", "Value" : { "Ref": "Owner" } },
				  { "Key" : "Approver", "Value" : { "Ref": "Approver" } }
				],
				"UserData": {
					"Fn::Base64": { "Fn::Join": [ "", [
						"<powershell>\n",
						"Rename-Computer -NewName ms238cpodsql074 -Restart\n",
						"</powershell>"
					]]}
				}
			}
		},
		"ms238cpodsql081": {
			"Type": "AWS::EC2::Instance",
			"Properties": {
				"AvailabilityZone": "us-east-1c",
				"IamInstanceProfile": "Sysco-ApplicationDefaultInstanceProfile-47RRMF15XFMP",
				"ImageId": "ami-1a659560",
				"InstanceType": "m4.large",
				"KeyName": { "Ref": "PemKey2" },
				"SecurityGroupIds": [{ "Ref": "CPDBSG" }, { "Ref": "NATCLIENT" }, "sg-42dc8b26"],
				"SubnetId": { "Ref": "Conf1c" },
				"BlockDeviceMappings": [
					{"DeviceName": "/dev/sda1", "Ebs": { "VolumeSize": "50", "VolumeType": "gp2" }},
					{"DeviceName": "xvdb", "Ebs": { "VolumeSize": "1", "VolumeType": "gp2" }},
					{"DeviceName": "xvdc", "Ebs": { "VolumeSize": "1", "VolumeType": "gp2" }},
					{"DeviceName": "xvdd", "Ebs": { "VolumeSize": "1", "VolumeType": "gp2" }},
					{"DeviceName": "xvde", "Ebs": { "VolumeSize": "150", "VolumeType": "gp2" }},
					{"DeviceName": "xvdf", "Ebs": { "VolumeSize": "150", "VolumeType": "gp2" }}
				],
				"Tags": [
				  { "Key" : "Name", "Value": "ms238cpodsql081" },
				  { "Key" : "Application_Id", "Value" : { "Ref": "ApplicationId" } },
				  { "Key" : "Application_Name", "Value" : { "Ref": "ApplicationName" } },
				  { "Key" : "Environment", "Value" :  { "Ref": "Environment" } },
				  { "Key" : "PO_Number", "Value" : { "Ref": "PONumber" } },
				  { "Key" : "Project_ID", "Value" : { "Ref": "ProjectId" } },
				  { "Key" : "Owner", "Value" : { "Ref": "Owner" } },
				  { "Key" : "Approver", "Value" : { "Ref": "Approver" } }
				],
				"UserData": {
					"Fn::Base64": { "Fn::Join": [ "", [
						"<powershell>\n",
						"$size = (Get-PartitionSupportedSize -DiskNumber 4 -PartitionNumber 2)\n",
						"Resize-Partition -DiskNumber 4 -PartitionNumber 2 -Size $size.SizeMax\n",
						"$size = (Get-PartitionSupportedSize -DiskNumber 5 -PartitionNumber 2)\n",
						"Resize-Partition -DiskNumber 5 -PartitionNumber 2 -Size $size.SizeMax\n",
						"Rename-Computer -NewName ms238cpodsql081 -Restart\n",
						"</powershell>"
					]]}
				}
			}
		},
		"ms238cpodsql082": {
			"Type": "AWS::EC2::Instance",
			"Properties": {
				"AvailabilityZone": "us-east-1d",
				"IamInstanceProfile": "Sysco-ApplicationDefaultInstanceProfile-47RRMF15XFMP",
				"ImageId": "ami-1a659560",
				"InstanceType": "m4.large",
				"KeyName": { "Ref": "PemKey2" },
				"SecurityGroupIds": [{ "Ref": "CPDBSG" }, { "Ref": "NATCLIENT" }, "sg-42dc8b26"],
				"SubnetId": { "Ref": "Conf1d" },
				"BlockDeviceMappings": [
					{"DeviceName": "/dev/sda1", "Ebs": { "VolumeSize": "50", "VolumeType": "gp2" }},
					{"DeviceName": "xvdb", "Ebs": { "VolumeSize": "1", "VolumeType": "gp2" }},
					{"DeviceName": "xvdc", "Ebs": { "VolumeSize": "1", "VolumeType": "gp2" }},
					{"DeviceName": "xvdd", "Ebs": { "VolumeSize": "1", "VolumeType": "gp2" }},
					{"DeviceName": "xvde", "Ebs": { "VolumeSize": "150", "VolumeType": "gp2" }},
					{"DeviceName": "xvdf", "Ebs": { "VolumeSize": "150", "VolumeType": "gp2" }}
				],
				"Tags": [
				  { "Key" : "Name", "Value": "ms238cpodsql082" },
				  { "Key" : "Application_Id", "Value" : { "Ref": "ApplicationId" } },
				  { "Key" : "Application_Name", "Value" : { "Ref": "ApplicationName" } },
				  { "Key" : "Environment", "Value" :  { "Ref": "Environment" } },
				  { "Key" : "PO_Number", "Value" : { "Ref": "PONumber" } },
				  { "Key" : "Project_ID", "Value" : { "Ref": "ProjectId" } },
				  { "Key" : "Owner", "Value" : { "Ref": "Owner" } },
				  { "Key" : "Approver", "Value" : { "Ref": "Approver" } }
				],
				"UserData": {
					"Fn::Base64": { "Fn::Join": [ "", [
						"<powershell>\n",
						"$size = (Get-PartitionSupportedSize -DiskNumber 4 -PartitionNumber 2)\n",
						"Resize-Partition -DiskNumber 4 -PartitionNumber 2 -Size $size.SizeMax\n",
						"$size = (Get-PartitionSupportedSize -DiskNumber 5 -PartitionNumber 2)\n",
						"Resize-Partition -DiskNumber 5 -PartitionNumber 2 -Size $size.SizeMax\n",
						"Rename-Computer -NewName ms238cpodsql082 -Restart\n",
						"</powershell>"
					]]}
				}
			}
		},
		"ms238cpodsql101": {
			"Type": "AWS::EC2::Instance",
			"Properties": {
				"AvailabilityZone": "us-east-1c",
				"IamInstanceProfile": "Sysco-ApplicationDefaultInstanceProfile-47RRMF15XFMP",
				"ImageId": "ami-1a659560",
				"InstanceType": "t2.large",
				"KeyName": { "Ref": "PemKey2" },
				"SecurityGroupIds": [{ "Ref": "CPDBSG" }, { "Ref": "NATCLIENT" }, "sg-42dc8b26"],
				"SubnetId": { "Ref": "Conf1c" },
				"BlockDeviceMappings": [
					{"DeviceName": "/dev/sda1", "Ebs": { "VolumeSize": "50", "VolumeType": "gp2" }},
					{"DeviceName": "xvdb", "Ebs": { "VolumeSize": "1", "VolumeType": "gp2" }},
					{"DeviceName": "xvdc", "Ebs": { "VolumeSize": "1", "VolumeType": "gp2" }},
					{"DeviceName": "xvdd", "Ebs": { "VolumeSize": "1", "VolumeType": "gp2" }},
					{"DeviceName": "xvde", "Ebs": { "VolumeSize": "100", "VolumeType": "gp2" }},
					{"DeviceName": "xvdf", "Ebs": { "VolumeSize": "100", "VolumeType": "gp2" }}
				],
				"Tags": [
				  { "Key" : "Name", "Value": "ms238cpodsql101" },
				  { "Key" : "Application_Id", "Value" : { "Ref": "ApplicationId" } },
				  { "Key" : "Application_Name", "Value" : { "Ref": "ApplicationName" } },
				  { "Key" : "Environment", "Value" :  { "Ref": "Environment" } },
				  { "Key" : "PO_Number", "Value" : { "Ref": "PONumber" } },
				  { "Key" : "Project_ID", "Value" : { "Ref": "ProjectId" } },
				  { "Key" : "Owner", "Value" : { "Ref": "Owner" } },
				  { "Key" : "Approver", "Value" : { "Ref": "Approver" } }
				],
				"UserData": {
					"Fn::Base64": { "Fn::Join": [ "", [
						"<powershell>\n",
						"$size = (Get-PartitionSupportedSize -DiskNumber 4 -PartitionNumber 2)\n",
						"Resize-Partition -DiskNumber 4 -PartitionNumber 2 -Size $size.SizeMax\n",
						"$size = (Get-PartitionSupportedSize -DiskNumber 5 -PartitionNumber 2)\n",
						"Resize-Partition -DiskNumber 5 -PartitionNumber 2 -Size $size.SizeMax\n",
						"Rename-Computer -NewName ms238cpodsql101 -Restart\n",
						"</powershell>"
					]]}
				}
			}
		},
		"ms238cpodsql102": {
			"Type": "AWS::EC2::Instance",
			"Properties": {
				"AvailabilityZone": "us-east-1d",
				"IamInstanceProfile": "Sysco-ApplicationDefaultInstanceProfile-47RRMF15XFMP",
				"ImageId": "ami-1a659560",
				"InstanceType": "t2.large",
				"KeyName": { "Ref": "PemKey2" },
				"SecurityGroupIds": [{ "Ref": "CPDBSG" }, { "Ref": "NATCLIENT" }, "sg-42dc8b26"],
				"SubnetId": { "Ref": "Conf1d" },
				"BlockDeviceMappings": [
					{"DeviceName": "/dev/sda1", "Ebs": { "VolumeSize": "50", "VolumeType": "gp2" }},
					{"DeviceName": "xvdb", "Ebs": { "VolumeSize": "1", "VolumeType": "gp2" }},
					{"DeviceName": "xvdc", "Ebs": { "VolumeSize": "1", "VolumeType": "gp2" }},
					{"DeviceName": "xvdd", "Ebs": { "VolumeSize": "1", "VolumeType": "gp2" }},
					{"DeviceName": "xvde", "Ebs": { "VolumeSize": "100", "VolumeType": "gp2" }},
					{"DeviceName": "xvdf", "Ebs": { "VolumeSize": "100", "VolumeType": "gp2" }}
				],
				"Tags": [
				  { "Key" : "Name", "Value": "ms238cpodsql102" },
				  { "Key" : "Application_Id", "Value" : { "Ref": "ApplicationId" } },
				  { "Key" : "Application_Name", "Value" : { "Ref": "ApplicationName" } },
				  { "Key" : "Environment", "Value" :  { "Ref": "Environment" } },
				  { "Key" : "PO_Number", "Value" : { "Ref": "PONumber" } },
				  { "Key" : "Project_ID", "Value" : { "Ref": "ProjectId" } },
				  { "Key" : "Owner", "Value" : { "Ref": "Owner" } },
				  { "Key" : "Approver", "Value" : { "Ref": "Approver" } }
				],
				"UserData": {
					"Fn::Base64": { "Fn::Join": [ "", [
						"<powershell>\n",
						"$size = (Get-PartitionSupportedSize -DiskNumber 4 -PartitionNumber 2)\n",
						"Resize-Partition -DiskNumber 4 -PartitionNumber 2 -Size $size.SizeMax\n",
						"$size = (Get-PartitionSupportedSize -DiskNumber 5 -PartitionNumber 2)\n",
						"Resize-Partition -DiskNumber 5 -PartitionNumber 2 -Size $size.SizeMax\n",
						"Rename-Computer -NewName ms238cpodsql102 -Restart\n",
						"</powershell>"
					]]}
				}
			}
		},
		"ms238cpodsql103": {
			"Type": "AWS::EC2::Instance",
			"Properties": {
				"AvailabilityZone": "us-east-1c",
				"IamInstanceProfile": "Sysco-ApplicationDefaultInstanceProfile-47RRMF15XFMP",
				"ImageId": "ami-1a659560",
				"InstanceType": "t2.large",
				"KeyName": { "Ref": "PemKey2" },
				"SecurityGroupIds": [{ "Ref": "CPDBSG" }, { "Ref": "NATCLIENT" }, "sg-42dc8b26"],
				"SubnetId": { "Ref": "Conf1c" },
				"BlockDeviceMappings": [
					{"DeviceName": "/dev/sda1", "Ebs": { "VolumeSize": "50", "VolumeType": "gp2" }},
					{"DeviceName": "xvdb", "Ebs": { "VolumeSize": "1", "VolumeType": "gp2" }},
					{"DeviceName": "xvdc", "Ebs": { "VolumeSize": "1", "VolumeType": "gp2" }},
					{"DeviceName": "xvdd", "Ebs": { "VolumeSize": "1", "VolumeType": "gp2" }},
					{"DeviceName": "xvde", "Ebs": { "VolumeSize": "100", "VolumeType": "gp2" }},
					{"DeviceName": "xvdf", "Ebs": { "VolumeSize": "100", "VolumeType": "gp2" }}
				],
				"Tags": [
				  { "Key" : "Name", "Value": "ms238cpodsql103" },
				  { "Key" : "Application_Id", "Value" : { "Ref": "ApplicationId" } },
				  { "Key" : "Application_Name", "Value" : { "Ref": "ApplicationName" } },
				  { "Key" : "Environment", "Value" :  { "Ref": "Environment" } },
				  { "Key" : "PO_Number", "Value" : { "Ref": "PONumber" } },
				  { "Key" : "Project_ID", "Value" : { "Ref": "ProjectId" } },
				  { "Key" : "Owner", "Value" : { "Ref": "Owner" } },
				  { "Key" : "Approver", "Value" : { "Ref": "Approver" } }
				],
				"UserData": {
					"Fn::Base64": { "Fn::Join": [ "", [
						"<powershell>\n",
						"$size = (Get-PartitionSupportedSize -DiskNumber 4 -PartitionNumber 2)\n",
						"Resize-Partition -DiskNumber 4 -PartitionNumber 2 -Size $size.SizeMax\n",
						"$size = (Get-PartitionSupportedSize -DiskNumber 5 -PartitionNumber 2)\n",
						"Resize-Partition -DiskNumber 5 -PartitionNumber 2 -Size $size.SizeMax\n",
						"Rename-Computer -NewName ms238cpodsql103 -Restart\n",
						"</powershell>"
					]]}
				}
			}
		},
		"ms238cpodsql104": {
			"Type": "AWS::EC2::Instance",
			"Properties": {
				"AvailabilityZone": "us-east-1d",
				"IamInstanceProfile": "Sysco-ApplicationDefaultInstanceProfile-47RRMF15XFMP",
				"ImageId": "ami-1a659560",
				"InstanceType": "t2.large",
				"KeyName": { "Ref": "PemKey2" },
				"SecurityGroupIds": [{ "Ref": "CPDBSG" }, { "Ref": "NATCLIENT" }, "sg-42dc8b26"],
				"SubnetId": { "Ref": "Conf1d" },
				"BlockDeviceMappings": [
					{"DeviceName": "/dev/sda1", "Ebs": { "VolumeSize": "50", "VolumeType": "gp2" }},
					{"DeviceName": "xvdb", "Ebs": { "VolumeSize": "1", "VolumeType": "gp2" }},
					{"DeviceName": "xvdc", "Ebs": { "VolumeSize": "1", "VolumeType": "gp2" }},
					{"DeviceName": "xvdd", "Ebs": { "VolumeSize": "1", "VolumeType": "gp2" }},
					{"DeviceName": "xvde", "Ebs": { "VolumeSize": "100", "VolumeType": "gp2" }},
					{"DeviceName": "xvdf", "Ebs": { "VolumeSize": "100", "VolumeType": "gp2" }}
				],
				"Tags": [
				  { "Key" : "Name", "Value": "ms238cpodsql104" },
				  { "Key" : "Application_Id", "Value" : { "Ref": "ApplicationId" } },
				  { "Key" : "Application_Name", "Value" : { "Ref": "ApplicationName" } },
				  { "Key" : "Environment", "Value" :  { "Ref": "Environment" } },
				  { "Key" : "PO_Number", "Value" : { "Ref": "PONumber" } },
				  { "Key" : "Project_ID", "Value" : { "Ref": "ProjectId" } },
				  { "Key" : "Owner", "Value" : { "Ref": "Owner" } },
				  { "Key" : "Approver", "Value" : { "Ref": "Approver" } }
				],
				"UserData": {
					"Fn::Base64": { "Fn::Join": [ "", [
						"<powershell>\n",
						"$size = (Get-PartitionSupportedSize -DiskNumber 4 -PartitionNumber 2)\n",
						"Resize-Partition -DiskNumber 4 -PartitionNumber 2 -Size $size.SizeMax\n",
						"$size = (Get-PartitionSupportedSize -DiskNumber 5 -PartitionNumber 2)\n",
						"Resize-Partition -DiskNumber 5 -PartitionNumber 2 -Size $size.SizeMax\n",
						"Rename-Computer -NewName ms238cpodsql104 -Restart\n",
						"</powershell>"
					]]}
				}
			}
		},
		"ms238cpodsql105": {
			"Type": "AWS::EC2::Instance",
			"Properties": {
				"AvailabilityZone": "us-east-1c",
				"IamInstanceProfile": "Sysco-ApplicationDefaultInstanceProfile-47RRMF15XFMP",
				"ImageId": "ami-1a659560",
				"InstanceType": "t2.large",
				"KeyName": { "Ref": "PemKey2" },
				"SecurityGroupIds": [{ "Ref": "CPDBSG" }, { "Ref": "NATCLIENT" }, "sg-42dc8b26"],
				"SubnetId": { "Ref": "Conf1c" },
				"BlockDeviceMappings": [
					{"DeviceName": "/dev/sda1", "Ebs": { "VolumeSize": "50", "VolumeType": "gp2" }},
					{"DeviceName": "xvdb", "Ebs": { "VolumeSize": "1", "VolumeType": "gp2" }},
					{"DeviceName": "xvdc", "Ebs": { "VolumeSize": "1", "VolumeType": "gp2" }},
					{"DeviceName": "xvdd", "Ebs": { "VolumeSize": "1", "VolumeType": "gp2" }},
					{"DeviceName": "xvde", "Ebs": { "VolumeSize": "100", "VolumeType": "gp2" }},
					{"DeviceName": "xvdf", "Ebs": { "VolumeSize": "100", "VolumeType": "gp2" }}
				],
				"Tags": [
				  { "Key" : "Name", "Value": "ms238cpodsql105" },
				  { "Key" : "Application_Id", "Value" : { "Ref": "ApplicationId" } },
				  { "Key" : "Application_Name", "Value" : { "Ref": "ApplicationName" } },
				  { "Key" : "Environment", "Value" :  { "Ref": "Environment" } },
				  { "Key" : "PO_Number", "Value" : { "Ref": "PONumber" } },
				  { "Key" : "Project_ID", "Value" : { "Ref": "ProjectId" } },
				  { "Key" : "Owner", "Value" : { "Ref": "Owner" } },
				  { "Key" : "Approver", "Value" : { "Ref": "Approver" } }
				],
				"UserData": {
					"Fn::Base64": { "Fn::Join": [ "", [
						"<powershell>\n",
						"$size = (Get-PartitionSupportedSize -DiskNumber 4 -PartitionNumber 2)\n",
						"Resize-Partition -DiskNumber 4 -PartitionNumber 2 -Size $size.SizeMax\n",
						"$size = (Get-PartitionSupportedSize -DiskNumber 5 -PartitionNumber 2)\n",
						"Resize-Partition -DiskNumber 5 -PartitionNumber 2 -Size $size.SizeMax\n",
						"Rename-Computer -NewName ms238cpodsql105 -Restart\n",
						"</powershell>"
					]]}
				}
			}
		},
		"ms238cpodsql106": {
			"Type": "AWS::EC2::Instance",
			"Properties": {
				"AvailabilityZone": "us-east-1d",
				"IamInstanceProfile": "Sysco-ApplicationDefaultInstanceProfile-47RRMF15XFMP",
				"ImageId": "ami-1a659560",
				"InstanceType": "t2.large",
				"KeyName": { "Ref": "PemKey2" },
				"SecurityGroupIds": [{ "Ref": "CPDBSG" }, { "Ref": "NATCLIENT" }, "sg-42dc8b26"],
				"SubnetId": { "Ref": "Conf1d" },
				"BlockDeviceMappings": [
					{"DeviceName": "/dev/sda1", "Ebs": { "VolumeSize": "50", "VolumeType": "gp2" }},
					{"DeviceName": "xvdb", "Ebs": { "VolumeSize": "1", "VolumeType": "gp2" }},
					{"DeviceName": "xvdc", "Ebs": { "VolumeSize": "1", "VolumeType": "gp2" }},
					{"DeviceName": "xvdd", "Ebs": { "VolumeSize": "1", "VolumeType": "gp2" }},
					{"DeviceName": "xvde", "Ebs": { "VolumeSize": "100", "VolumeType": "gp2" }},
					{"DeviceName": "xvdf", "Ebs": { "VolumeSize": "100", "VolumeType": "gp2" }}
				],
				"Tags": [
				  { "Key" : "Name", "Value": "ms238cpodsql106" },
				  { "Key" : "Application_Id", "Value" : { "Ref": "ApplicationId" } },
				  { "Key" : "Application_Name", "Value" : { "Ref": "ApplicationName" } },
				  { "Key" : "Environment", "Value" :  { "Ref": "Environment" } },
				  { "Key" : "PO_Number", "Value" : { "Ref": "PONumber" } },
				  { "Key" : "Project_ID", "Value" : { "Ref": "ProjectId" } },
				  { "Key" : "Owner", "Value" : { "Ref": "Owner" } },
				  { "Key" : "Approver", "Value" : { "Ref": "Approver" } }
				],
				"UserData": {
					"Fn::Base64": { "Fn::Join": [ "", [
						"<powershell>\n",
						"$size = (Get-PartitionSupportedSize -DiskNumber 4 -PartitionNumber 2)\n",
						"Resize-Partition -DiskNumber 4 -PartitionNumber 2 -Size $size.SizeMax\n",
						"$size = (Get-PartitionSupportedSize -DiskNumber 5 -PartitionNumber 2)\n",
						"Resize-Partition -DiskNumber 5 -PartitionNumber 2 -Size $size.SizeMax\n",
						"Rename-Computer -NewName ms238cpodsql106 -Restart\n",
						"</powershell>"
					]]}
				}
			}
		},
		"ms238cpodsql107": {
			"Type": "AWS::EC2::Instance",
			"Properties": {
				"AvailabilityZone": "us-east-1c",
				"IamInstanceProfile": "Sysco-ApplicationDefaultInstanceProfile-47RRMF15XFMP",
				"ImageId": "ami-1a659560",
				"InstanceType": "t2.large",
				"KeyName": { "Ref": "PemKey2" },
				"SecurityGroupIds": [{ "Ref": "CPDBSG" }, { "Ref": "NATCLIENT" }, "sg-42dc8b26"],
				"SubnetId": { "Ref": "Conf1c" },
				"BlockDeviceMappings": [
					{"DeviceName": "/dev/sda1", "Ebs": { "VolumeSize": "50", "VolumeType": "gp2" }},
					{"DeviceName": "xvdb", "Ebs": { "VolumeSize": "1", "VolumeType": "gp2" }},
					{"DeviceName": "xvdc", "Ebs": { "VolumeSize": "1", "VolumeType": "gp2" }},
					{"DeviceName": "xvdd", "Ebs": { "VolumeSize": "1", "VolumeType": "gp2" }},
					{"DeviceName": "xvde", "Ebs": { "VolumeSize": "100", "VolumeType": "gp2" }},
					{"DeviceName": "xvdf", "Ebs": { "VolumeSize": "100", "VolumeType": "gp2" }}
				],
				"Tags": [
				  { "Key" : "Name", "Value": "ms238cpodsql107" },
				  { "Key" : "Application_Id", "Value" : { "Ref": "ApplicationId" } },
				  { "Key" : "Application_Name", "Value" : { "Ref": "ApplicationName" } },
				  { "Key" : "Environment", "Value" :  { "Ref": "Environment" } },
				  { "Key" : "PO_Number", "Value" : { "Ref": "PONumber" } },
				  { "Key" : "Project_ID", "Value" : { "Ref": "ProjectId" } },
				  { "Key" : "Owner", "Value" : { "Ref": "Owner" } },
				  { "Key" : "Approver", "Value" : { "Ref": "Approver" } }
				],
				"UserData": {
					"Fn::Base64": { "Fn::Join": [ "", [
						"<powershell>\n",
						"$size = (Get-PartitionSupportedSize -DiskNumber 4 -PartitionNumber 2)\n",
						"Resize-Partition -DiskNumber 4 -PartitionNumber 2 -Size $size.SizeMax\n",
						"$size = (Get-PartitionSupportedSize -DiskNumber 5 -PartitionNumber 2)\n",
						"Resize-Partition -DiskNumber 5 -PartitionNumber 2 -Size $size.SizeMax\n",
						"Rename-Computer -NewName ms238cpodsql107 -Restart\n",
						"</powershell>"
					]]}
				}
			}
		},
		"ms238cpodsql108": {
			"Type": "AWS::EC2::Instance",
			"Properties": {
				"AvailabilityZone": "us-east-1d",
				"IamInstanceProfile": "Sysco-ApplicationDefaultInstanceProfile-47RRMF15XFMP",
				"ImageId": "ami-1a659560",
				"InstanceType": "t2.large",
				"KeyName": { "Ref": "PemKey2" },
				"SecurityGroupIds": [{ "Ref": "CPDBSG" }, { "Ref": "NATCLIENT" }, "sg-42dc8b26"],
				"SubnetId": { "Ref": "Conf1d" },
				"BlockDeviceMappings": [
					{"DeviceName": "/dev/sda1", "Ebs": { "VolumeSize": "50", "VolumeType": "gp2" }},
					{"DeviceName": "xvdb", "Ebs": { "VolumeSize": "1", "VolumeType": "gp2" }},
					{"DeviceName": "xvdc", "Ebs": { "VolumeSize": "1", "VolumeType": "gp2" }},
					{"DeviceName": "xvdd", "Ebs": { "VolumeSize": "1", "VolumeType": "gp2" }},
					{"DeviceName": "xvde", "Ebs": { "VolumeSize": "100", "VolumeType": "gp2" }},
					{"DeviceName": "xvdf", "Ebs": { "VolumeSize": "100", "VolumeType": "gp2" }}
				],
				"Tags": [
				  { "Key" : "Name", "Value": "ms238cpodsql108" },
				  { "Key" : "Application_Id", "Value" : { "Ref": "ApplicationId" } },
				  { "Key" : "Application_Name", "Value" : { "Ref": "ApplicationName" } },
				  { "Key" : "Environment", "Value" :  { "Ref": "Environment" } },
				  { "Key" : "PO_Number", "Value" : { "Ref": "PONumber" } },
				  { "Key" : "Project_ID", "Value" : { "Ref": "ProjectId" } },
				  { "Key" : "Owner", "Value" : { "Ref": "Owner" } },
				  { "Key" : "Approver", "Value" : { "Ref": "Approver" } }
				],
				"UserData": {
					"Fn::Base64": { "Fn::Join": [ "", [
						"<powershell>\n",
						"$size = (Get-PartitionSupportedSize -DiskNumber 4 -PartitionNumber 2)\n",
						"Resize-Partition -DiskNumber 4 -PartitionNumber 2 -Size $size.SizeMax\n",
						"$size = (Get-PartitionSupportedSize -DiskNumber 5 -PartitionNumber 2)\n",
						"Resize-Partition -DiskNumber 5 -PartitionNumber 2 -Size $size.SizeMax\n",
						"Rename-Computer -NewName ms238cpodsql108 -Restart\n",
						"</powershell>"
					]]}
				}
			}
		},
		"ms238cpodsql109": {
			"Type": "AWS::EC2::Instance",
			"Properties": {
				"AvailabilityZone": "us-east-1c",
				"IamInstanceProfile": "Sysco-ApplicationDefaultInstanceProfile-47RRMF15XFMP",
				"ImageId": "ami-1a659560",
				"InstanceType": "t2.large",
				"KeyName": { "Ref": "PemKey2" },
				"SecurityGroupIds": [{ "Ref": "CPDBSG" }, { "Ref": "NATCLIENT" }, "sg-42dc8b26"],
				"SubnetId": { "Ref": "Conf1c" },
				"BlockDeviceMappings": [
					{"DeviceName": "/dev/sda1", "Ebs": { "VolumeSize": "50", "VolumeType": "gp2" }},
					{"DeviceName": "xvdb", "Ebs": { "VolumeSize": "1", "VolumeType": "gp2" }},
					{"DeviceName": "xvdc", "Ebs": { "VolumeSize": "1", "VolumeType": "gp2" }},
					{"DeviceName": "xvdd", "Ebs": { "VolumeSize": "1", "VolumeType": "gp2" }},
					{"DeviceName": "xvde", "Ebs": { "VolumeSize": "100", "VolumeType": "gp2" }},
					{"DeviceName": "xvdf", "Ebs": { "VolumeSize": "100", "VolumeType": "gp2" }}
				],
				"Tags": [
				  { "Key" : "Name", "Value": "ms238cpodsql109" },
				  { "Key" : "Application_Id", "Value" : { "Ref": "ApplicationId" } },
				  { "Key" : "Application_Name", "Value" : { "Ref": "ApplicationName" } },
				  { "Key" : "Environment", "Value" :  { "Ref": "Environment" } },
				  { "Key" : "PO_Number", "Value" : { "Ref": "PONumber" } },
				  { "Key" : "Project_ID", "Value" : { "Ref": "ProjectId" } },
				  { "Key" : "Owner", "Value" : { "Ref": "Owner" } },
				  { "Key" : "Approver", "Value" : { "Ref": "Approver" } }
				],
				"UserData": {
					"Fn::Base64": { "Fn::Join": [ "", [
						"<powershell>\n",
						"$size = (Get-PartitionSupportedSize -DiskNumber 4 -PartitionNumber 2)\n",
						"Resize-Partition -DiskNumber 4 -PartitionNumber 2 -Size $size.SizeMax\n",
						"$size = (Get-PartitionSupportedSize -DiskNumber 5 -PartitionNumber 2)\n",
						"Resize-Partition -DiskNumber 5 -PartitionNumber 2 -Size $size.SizeMax\n",
						"Rename-Computer -NewName ms238cpodsql109 -Restart\n",
						"</powershell>"
					]]}
				}
			}
		},
		"ms238cpodsql110": {
			"Type": "AWS::EC2::Instance",
			"Properties": {
				"AvailabilityZone": "us-east-1d",
				"IamInstanceProfile": "Sysco-ApplicationDefaultInstanceProfile-47RRMF15XFMP",
				"ImageId": "ami-1a659560",
				"InstanceType": "t2.large",
				"KeyName": { "Ref": "PemKey2" },
				"SecurityGroupIds": [{ "Ref": "CPDBSG" }, { "Ref": "NATCLIENT" }, "sg-42dc8b26"],
				"SubnetId": { "Ref": "Conf1d" },
				"BlockDeviceMappings": [
					{"DeviceName": "/dev/sda1", "Ebs": { "VolumeSize": "50", "VolumeType": "gp2" }},
					{"DeviceName": "xvdb", "Ebs": { "VolumeSize": "1", "VolumeType": "gp2" }},
					{"DeviceName": "xvdc", "Ebs": { "VolumeSize": "1", "VolumeType": "gp2" }},
					{"DeviceName": "xvdd", "Ebs": { "VolumeSize": "1", "VolumeType": "gp2" }},
					{"DeviceName": "xvde", "Ebs": { "VolumeSize": "100", "VolumeType": "gp2" }},
					{"DeviceName": "xvdf", "Ebs": { "VolumeSize": "100", "VolumeType": "gp2" }}
				],
				"Tags": [
				  { "Key" : "Name", "Value": "ms238cpodsql110" },
				  { "Key" : "Application_Id", "Value" : { "Ref": "ApplicationId" } },
				  { "Key" : "Application_Name", "Value" : { "Ref": "ApplicationName" } },
				  { "Key" : "Environment", "Value" :  { "Ref": "Environment" } },
				  { "Key" : "PO_Number", "Value" : { "Ref": "PONumber" } },
				  { "Key" : "Project_ID", "Value" : { "Ref": "ProjectId" } },
				  { "Key" : "Owner", "Value" : { "Ref": "Owner" } },
				  { "Key" : "Approver", "Value" : { "Ref": "Approver" } }
				],
				"UserData": {
					"Fn::Base64": { "Fn::Join": [ "", [
						"<powershell>\n",
						"$size = (Get-PartitionSupportedSize -DiskNumber 4 -PartitionNumber 2)\n",
						"Resize-Partition -DiskNumber 4 -PartitionNumber 2 -Size $size.SizeMax\n",
						"$size = (Get-PartitionSupportedSize -DiskNumber 5 -PartitionNumber 2)\n",
						"Resize-Partition -DiskNumber 5 -PartitionNumber 2 -Size $size.SizeMax\n",
						"Rename-Computer -NewName ms238cpodsql110 -Restart\n",
						"</powershell>"
					]]}
				}
			}
		},
		"ms238cpodsql111": {
			"Type": "AWS::EC2::Instance",
			"Properties": {
				"AvailabilityZone": "us-east-1c",
				"IamInstanceProfile": "Sysco-ApplicationDefaultInstanceProfile-47RRMF15XFMP",
				"ImageId": "ami-1a659560",
				"InstanceType": "t2.large",
				"KeyName": { "Ref": "PemKey2" },
				"SecurityGroupIds": [{ "Ref": "CPDBSG" }, { "Ref": "NATCLIENT" }, "sg-42dc8b26"],
				"SubnetId": { "Ref": "Conf1c" },
				"BlockDeviceMappings": [
					{"DeviceName": "/dev/sda1", "Ebs": { "VolumeSize": "50", "VolumeType": "gp2" }},
					{"DeviceName": "xvdb", "Ebs": { "VolumeSize": "1", "VolumeType": "gp2" }},
					{"DeviceName": "xvdc", "Ebs": { "VolumeSize": "1", "VolumeType": "gp2" }},
					{"DeviceName": "xvdd", "Ebs": { "VolumeSize": "1", "VolumeType": "gp2" }},
					{"DeviceName": "xvde", "Ebs": { "VolumeSize": "100", "VolumeType": "gp2" }},
					{"DeviceName": "xvdf", "Ebs": { "VolumeSize": "100", "VolumeType": "gp2" }}
				],
				"Tags": [
				  { "Key" : "Name", "Value": "ms238cpodsql111" },
				  { "Key" : "Application_Id", "Value" : { "Ref": "ApplicationId" } },
				  { "Key" : "Application_Name", "Value" : { "Ref": "ApplicationName" } },
				  { "Key" : "Environment", "Value" :  { "Ref": "Environment" } },
				  { "Key" : "PO_Number", "Value" : { "Ref": "PONumber" } },
				  { "Key" : "Project_ID", "Value" : { "Ref": "ProjectId" } },
				  { "Key" : "Owner", "Value" : { "Ref": "Owner" } },
				  { "Key" : "Approver", "Value" : { "Ref": "Approver" } }
				],
				"UserData": {
					"Fn::Base64": { "Fn::Join": [ "", [
						"<powershell>\n",
						"$size = (Get-PartitionSupportedSize -DiskNumber 4 -PartitionNumber 2)\n",
						"Resize-Partition -DiskNumber 4 -PartitionNumber 2 -Size $size.SizeMax\n",
						"$size = (Get-PartitionSupportedSize -DiskNumber 5 -PartitionNumber 2)\n",
						"Resize-Partition -DiskNumber 5 -PartitionNumber 2 -Size $size.SizeMax\n",
						"Rename-Computer -NewName ms238cpodsql111 -Restart\n",
						"</powershell>"
					]]}
				}
			}
		},
		"ms238cpodsql112": {
			"Type": "AWS::EC2::Instance",
			"Properties": {
				"AvailabilityZone": "us-east-1d",
				"IamInstanceProfile": "Sysco-ApplicationDefaultInstanceProfile-47RRMF15XFMP",
				"ImageId": "ami-1a659560",
				"InstanceType": "t2.large",
				"KeyName": { "Ref": "PemKey2" },
				"SecurityGroupIds": [{ "Ref": "CPDBSG" }, { "Ref": "NATCLIENT" }, "sg-42dc8b26"],
				"SubnetId": { "Ref": "Conf1d" },
				"BlockDeviceMappings": [
					{"DeviceName": "/dev/sda1", "Ebs": { "VolumeSize": "50", "VolumeType": "gp2" }},
					{"DeviceName": "xvdb", "Ebs": { "VolumeSize": "1", "VolumeType": "gp2" }},
					{"DeviceName": "xvdc", "Ebs": { "VolumeSize": "1", "VolumeType": "gp2" }},
					{"DeviceName": "xvdd", "Ebs": { "VolumeSize": "1", "VolumeType": "gp2" }},
					{"DeviceName": "xvde", "Ebs": { "VolumeSize": "100", "VolumeType": "gp2" }},
					{"DeviceName": "xvdf", "Ebs": { "VolumeSize": "100", "VolumeType": "gp2" }}
				],
				"Tags": [
				  { "Key" : "Name", "Value": "ms238cpodsql112" },
				  { "Key" : "Application_Id", "Value" : { "Ref": "ApplicationId" } },
				  { "Key" : "Application_Name", "Value" : { "Ref": "ApplicationName" } },
				  { "Key" : "Environment", "Value" :  { "Ref": "Environment" } },
				  { "Key" : "PO_Number", "Value" : { "Ref": "PONumber" } },
				  { "Key" : "Project_ID", "Value" : { "Ref": "ProjectId" } },
				  { "Key" : "Owner", "Value" : { "Ref": "Owner" } },
				  { "Key" : "Approver", "Value" : { "Ref": "Approver" } }
				],
				"UserData": {
					"Fn::Base64": { "Fn::Join": [ "", [
						"<powershell>\n",
						"$size = (Get-PartitionSupportedSize -DiskNumber 4 -PartitionNumber 2)\n",
						"Resize-Partition -DiskNumber 4 -PartitionNumber 2 -Size $size.SizeMax\n",
						"$size = (Get-PartitionSupportedSize -DiskNumber 5 -PartitionNumber 2)\n",
						"Resize-Partition -DiskNumber 5 -PartitionNumber 2 -Size $size.SizeMax\n",
						"Rename-Computer -NewName ms238cpodsql112 -Restart\n",
						"</powershell>"
					]]}
				}
			}
		},
		"ms238cpodsql113": {
			"Type": "AWS::EC2::Instance",
			"Properties": {
				"AvailabilityZone": "us-east-1c",
				"IamInstanceProfile": "Sysco-ApplicationDefaultInstanceProfile-47RRMF15XFMP",
				"ImageId": "ami-1a659560",
				"InstanceType": "t2.large",
				"KeyName": { "Ref": "PemKey2" },
				"SecurityGroupIds": [{ "Ref": "CPDBSG" }, { "Ref": "NATCLIENT" }, "sg-42dc8b26"],
				"SubnetId": { "Ref": "Conf1c" },
				"BlockDeviceMappings": [
					{"DeviceName": "/dev/sda1", "Ebs": { "VolumeSize": "50", "VolumeType": "gp2" }},
					{"DeviceName": "xvdb", "Ebs": { "VolumeSize": "1", "VolumeType": "gp2" }},
					{"DeviceName": "xvdc", "Ebs": { "VolumeSize": "1", "VolumeType": "gp2" }},
					{"DeviceName": "xvdd", "Ebs": { "VolumeSize": "1", "VolumeType": "gp2" }},
					{"DeviceName": "xvde", "Ebs": { "VolumeSize": "100", "VolumeType": "gp2" }},
					{"DeviceName": "xvdf", "Ebs": { "VolumeSize": "100", "VolumeType": "gp2" }}
				],
				"Tags": [
				  { "Key" : "Name", "Value": "ms238cpodsql113" },
				  { "Key" : "Application_Id", "Value" : { "Ref": "ApplicationId" } },
				  { "Key" : "Application_Name", "Value" : { "Ref": "ApplicationName" } },
				  { "Key" : "Environment", "Value" :  { "Ref": "Environment" } },
				  { "Key" : "PO_Number", "Value" : { "Ref": "PONumber" } },
				  { "Key" : "Project_ID", "Value" : { "Ref": "ProjectId" } },
				  { "Key" : "Owner", "Value" : { "Ref": "Owner" } },
				  { "Key" : "Approver", "Value" : { "Ref": "Approver" } }
				],
				"UserData": {
					"Fn::Base64": { "Fn::Join": [ "", [
						"<powershell>\n",
						"$size = (Get-PartitionSupportedSize -DiskNumber 4 -PartitionNumber 2)\n",
						"Resize-Partition -DiskNumber 4 -PartitionNumber 2 -Size $size.SizeMax\n",
						"$size = (Get-PartitionSupportedSize -DiskNumber 5 -PartitionNumber 2)\n",
						"Resize-Partition -DiskNumber 5 -PartitionNumber 2 -Size $size.SizeMax\n",
						"Rename-Computer -NewName ms238cpodsql113 -Restart\n",
						"</powershell>"
					]]}
				}
			}
		},
		"ms238cpodsql114": {
			"Type": "AWS::EC2::Instance",
			"Properties": {
				"AvailabilityZone": "us-east-1d",
				"IamInstanceProfile": "Sysco-ApplicationDefaultInstanceProfile-47RRMF15XFMP",
				"ImageId": "ami-1a659560",
				"InstanceType": "t2.large",
				"KeyName": { "Ref": "PemKey2" },
				"SecurityGroupIds": [{ "Ref": "CPDBSG" }, { "Ref": "NATCLIENT" }, "sg-42dc8b26"],
				"SubnetId": { "Ref": "Conf1d" },
				"BlockDeviceMappings": [
					{"DeviceName": "/dev/sda1", "Ebs": { "VolumeSize": "50", "VolumeType": "gp2" }},
					{"DeviceName": "xvdb", "Ebs": { "VolumeSize": "1", "VolumeType": "gp2" }},
					{"DeviceName": "xvdc", "Ebs": { "VolumeSize": "1", "VolumeType": "gp2" }},
					{"DeviceName": "xvdd", "Ebs": { "VolumeSize": "1", "VolumeType": "gp2" }},
					{"DeviceName": "xvde", "Ebs": { "VolumeSize": "100", "VolumeType": "gp2" }},
					{"DeviceName": "xvdf", "Ebs": { "VolumeSize": "100", "VolumeType": "gp2" }}
				],
				"Tags": [
				  { "Key" : "Name", "Value": "ms238cpodsql114" },
				  { "Key" : "Application_Id", "Value" : { "Ref": "ApplicationId" } },
				  { "Key" : "Application_Name", "Value" : { "Ref": "ApplicationName" } },
				  { "Key" : "Environment", "Value" :  { "Ref": "Environment" } },
				  { "Key" : "PO_Number", "Value" : { "Ref": "PONumber" } },
				  { "Key" : "Project_ID", "Value" : { "Ref": "ProjectId" } },
				  { "Key" : "Owner", "Value" : { "Ref": "Owner" } },
				  { "Key" : "Approver", "Value" : { "Ref": "Approver" } }
				],
				"UserData": {
					"Fn::Base64": { "Fn::Join": [ "", [
						"<powershell>\n",
						"$size = (Get-PartitionSupportedSize -DiskNumber 4 -PartitionNumber 2)\n",
						"Resize-Partition -DiskNumber 4 -PartitionNumber 2 -Size $size.SizeMax\n",
						"$size = (Get-PartitionSupportedSize -DiskNumber 5 -PartitionNumber 2)\n",
						"Resize-Partition -DiskNumber 5 -PartitionNumber 2 -Size $size.SizeMax\n",
						"Rename-Computer -NewName ms238cpodsql114 -Restart\n",
						"</powershell>"
					]]}
				}
			}
		},
		"ms238cpodsql115": {
			"Type": "AWS::EC2::Instance",
			"Properties": {
				"AvailabilityZone": "us-east-1c",
				"IamInstanceProfile": "Sysco-ApplicationDefaultInstanceProfile-47RRMF15XFMP",
				"ImageId": "ami-1a659560",
				"InstanceType": "t2.large",
				"KeyName": { "Ref": "PemKey2" },
				"SecurityGroupIds": [{ "Ref": "CPDBSG" }, { "Ref": "NATCLIENT" }, "sg-42dc8b26"],
				"SubnetId": { "Ref": "Conf1c" },
				"BlockDeviceMappings": [
					{"DeviceName": "/dev/sda1", "Ebs": { "VolumeSize": "50", "VolumeType": "gp2" }},
					{"DeviceName": "xvdb", "Ebs": { "VolumeSize": "1", "VolumeType": "gp2" }},
					{"DeviceName": "xvdc", "Ebs": { "VolumeSize": "1", "VolumeType": "gp2" }},
					{"DeviceName": "xvdd", "Ebs": { "VolumeSize": "1", "VolumeType": "gp2" }},
					{"DeviceName": "xvde", "Ebs": { "VolumeSize": "100", "VolumeType": "gp2" }},
					{"DeviceName": "xvdf", "Ebs": { "VolumeSize": "100", "VolumeType": "gp2" }}
				],
				"Tags": [
				  { "Key" : "Name", "Value": "ms238cpodsql115" },
				  { "Key" : "Application_Id", "Value" : { "Ref": "ApplicationId" } },
				  { "Key" : "Application_Name", "Value" : { "Ref": "ApplicationName" } },
				  { "Key" : "Environment", "Value" :  { "Ref": "Environment" } },
				  { "Key" : "PO_Number", "Value" : { "Ref": "PONumber" } },
				  { "Key" : "Project_ID", "Value" : { "Ref": "ProjectId" } },
				  { "Key" : "Owner", "Value" : { "Ref": "Owner" } },
				  { "Key" : "Approver", "Value" : { "Ref": "Approver" } }
				],
				"UserData": {
					"Fn::Base64": { "Fn::Join": [ "", [
						"<powershell>\n",
						"$size = (Get-PartitionSupportedSize -DiskNumber 4 -PartitionNumber 2)\n",
						"Resize-Partition -DiskNumber 4 -PartitionNumber 2 -Size $size.SizeMax\n",
						"$size = (Get-PartitionSupportedSize -DiskNumber 5 -PartitionNumber 2)\n",
						"Resize-Partition -DiskNumber 5 -PartitionNumber 2 -Size $size.SizeMax\n",
						"Rename-Computer -NewName ms238cpodsql115 -Restart\n",
						"</powershell>"
					]]}
				}
			}
		},
		"ms238cpodsql116": {
			"Type": "AWS::EC2::Instance",
			"Properties": {
				"AvailabilityZone": "us-east-1d",
				"IamInstanceProfile": "Sysco-ApplicationDefaultInstanceProfile-47RRMF15XFMP",
				"ImageId": "ami-1a659560",
				"InstanceType": "t2.large",
				"KeyName": { "Ref": "PemKey2" },
				"SecurityGroupIds": [{ "Ref": "CPDBSG" }, { "Ref": "NATCLIENT" }, "sg-42dc8b26"],
				"SubnetId": { "Ref": "Conf1d" },
				"BlockDeviceMappings": [
					{"DeviceName": "/dev/sda1", "Ebs": { "VolumeSize": "50", "VolumeType": "gp2" }},
					{"DeviceName": "xvdb", "Ebs": { "VolumeSize": "1", "VolumeType": "gp2" }},
					{"DeviceName": "xvdc", "Ebs": { "VolumeSize": "1", "VolumeType": "gp2" }},
					{"DeviceName": "xvdd", "Ebs": { "VolumeSize": "1", "VolumeType": "gp2" }},
					{"DeviceName": "xvde", "Ebs": { "VolumeSize": "100", "VolumeType": "gp2" }},
					{"DeviceName": "xvdf", "Ebs": { "VolumeSize": "100", "VolumeType": "gp2" }}
				],
				"Tags": [
				  { "Key" : "Name", "Value": "ms238cpodsql116" },
				  { "Key" : "Application_Id", "Value" : { "Ref": "ApplicationId" } },
				  { "Key" : "Application_Name", "Value" : { "Ref": "ApplicationName" } },
				  { "Key" : "Environment", "Value" :  { "Ref": "Environment" } },
				  { "Key" : "PO_Number", "Value" : { "Ref": "PONumber" } },
				  { "Key" : "Project_ID", "Value" : { "Ref": "ProjectId" } },
				  { "Key" : "Owner", "Value" : { "Ref": "Owner" } },
				  { "Key" : "Approver", "Value" : { "Ref": "Approver" } }
				],
				"UserData": {
					"Fn::Base64": { "Fn::Join": [ "", [
						"<powershell>\n",
						"$size = (Get-PartitionSupportedSize -DiskNumber 4 -PartitionNumber 2)\n",
						"Resize-Partition -DiskNumber 4 -PartitionNumber 2 -Size $size.SizeMax\n",
						"$size = (Get-PartitionSupportedSize -DiskNumber 5 -PartitionNumber 2)\n",
						"Resize-Partition -DiskNumber 5 -PartitionNumber 2 -Size $size.SizeMax\n",
						"Rename-Computer -NewName ms238cpodsql116 -Restart\n",
						"</powershell>"
					]]}
				}
			}
		},
		"ms238cpodsql117": {
			"Type": "AWS::EC2::Instance",
			"Properties": {
				"AvailabilityZone": "us-east-1c",
				"IamInstanceProfile": "Sysco-ApplicationDefaultInstanceProfile-47RRMF15XFMP",
				"ImageId": "ami-1a659560",
				"InstanceType": "t2.large",
				"KeyName": { "Ref": "PemKey2" },
				"SecurityGroupIds": [{ "Ref": "CPDBSG" }, { "Ref": "NATCLIENT" }, "sg-42dc8b26"],
				"SubnetId": { "Ref": "Conf1c" },
				"BlockDeviceMappings": [
					{"DeviceName": "/dev/sda1", "Ebs": { "VolumeSize": "50", "VolumeType": "gp2" }},
					{"DeviceName": "xvdb", "Ebs": { "VolumeSize": "1", "VolumeType": "gp2" }},
					{"DeviceName": "xvdc", "Ebs": { "VolumeSize": "1", "VolumeType": "gp2" }},
					{"DeviceName": "xvdd", "Ebs": { "VolumeSize": "1", "VolumeType": "gp2" }},
					{"DeviceName": "xvde", "Ebs": { "VolumeSize": "100", "VolumeType": "gp2" }},
					{"DeviceName": "xvdf", "Ebs": { "VolumeSize": "100", "VolumeType": "gp2" }}
				],
				"Tags": [
				  { "Key" : "Name", "Value": "ms238cpodsql117" },
				  { "Key" : "Application_Id", "Value" : { "Ref": "ApplicationId" } },
				  { "Key" : "Application_Name", "Value" : { "Ref": "ApplicationName" } },
				  { "Key" : "Environment", "Value" :  { "Ref": "Environment" } },
				  { "Key" : "PO_Number", "Value" : { "Ref": "PONumber" } },
				  { "Key" : "Project_ID", "Value" : { "Ref": "ProjectId" } },
				  { "Key" : "Owner", "Value" : { "Ref": "Owner" } },
				  { "Key" : "Approver", "Value" : { "Ref": "Approver" } }
				],
				"UserData": {
					"Fn::Base64": { "Fn::Join": [ "", [
						"<powershell>\n",
						"$size = (Get-PartitionSupportedSize -DiskNumber 4 -PartitionNumber 2)\n",
						"Resize-Partition -DiskNumber 4 -PartitionNumber 2 -Size $size.SizeMax\n",
						"$size = (Get-PartitionSupportedSize -DiskNumber 5 -PartitionNumber 2)\n",
						"Resize-Partition -DiskNumber 5 -PartitionNumber 2 -Size $size.SizeMax\n",
						"Rename-Computer -NewName ms238cpodsql117 -Restart\n",
						"</powershell>"
					]]}
				}
			}
		},
		"ms238cpodsql118": {
			"Type": "AWS::EC2::Instance",
			"Properties": {
				"AvailabilityZone": "us-east-1d",
				"IamInstanceProfile": "Sysco-ApplicationDefaultInstanceProfile-47RRMF15XFMP",
				"ImageId": "ami-1a659560",
				"InstanceType": "t2.large",
				"KeyName": { "Ref": "PemKey2" },
				"SecurityGroupIds": [{ "Ref": "CPDBSG" }, { "Ref": "NATCLIENT" }, "sg-42dc8b26"],
				"SubnetId": { "Ref": "Conf1d" },
				"BlockDeviceMappings": [
					{"DeviceName": "/dev/sda1", "Ebs": { "VolumeSize": "50", "VolumeType": "gp2" }},
					{"DeviceName": "xvdb", "Ebs": { "VolumeSize": "1", "VolumeType": "gp2" }},
					{"DeviceName": "xvdc", "Ebs": { "VolumeSize": "1", "VolumeType": "gp2" }},
					{"DeviceName": "xvdd", "Ebs": { "VolumeSize": "1", "VolumeType": "gp2" }},
					{"DeviceName": "xvde", "Ebs": { "VolumeSize": "100", "VolumeType": "gp2" }},
					{"DeviceName": "xvdf", "Ebs": { "VolumeSize": "100", "VolumeType": "gp2" }}
				],
				"Tags": [
				  { "Key" : "Name", "Value": "ms238cpodsql118" },
				  { "Key" : "Application_Id", "Value" : { "Ref": "ApplicationId" } },
				  { "Key" : "Application_Name", "Value" : { "Ref": "ApplicationName" } },
				  { "Key" : "Environment", "Value" :  { "Ref": "Environment" } },
				  { "Key" : "PO_Number", "Value" : { "Ref": "PONumber" } },
				  { "Key" : "Project_ID", "Value" : { "Ref": "ProjectId" } },
				  { "Key" : "Owner", "Value" : { "Ref": "Owner" } },
				  { "Key" : "Approver", "Value" : { "Ref": "Approver" } }
				],
				"UserData": {
					"Fn::Base64": { "Fn::Join": [ "", [
						"<powershell>\n",
						"$size = (Get-PartitionSupportedSize -DiskNumber 4 -PartitionNumber 2)\n",
						"Resize-Partition -DiskNumber 4 -PartitionNumber 2 -Size $size.SizeMax\n",
						"$size = (Get-PartitionSupportedSize -DiskNumber 5 -PartitionNumber 2)\n",
						"Resize-Partition -DiskNumber 5 -PartitionNumber 2 -Size $size.SizeMax\n",
						"Rename-Computer -NewName ms238cpodsql118 -Restart\n",
						"</powershell>"
					]]}
				}
			}
		},
		"ms238cpodsql119": {
			"Type": "AWS::EC2::Instance",
			"Properties": {
				"AvailabilityZone": "us-east-1c",
				"IamInstanceProfile": "Sysco-ApplicationDefaultInstanceProfile-47RRMF15XFMP",
				"ImageId": "ami-1a659560",
				"InstanceType": "t2.large",
				"KeyName": { "Ref": "PemKey2" },
				"SecurityGroupIds": [{ "Ref": "CPDBSG" }, { "Ref": "NATCLIENT" }, "sg-42dc8b26"],
				"SubnetId": { "Ref": "Conf1c" },
				"BlockDeviceMappings": [
					{"DeviceName": "/dev/sda1", "Ebs": { "VolumeSize": "50", "VolumeType": "gp2" }},
					{"DeviceName": "xvdb", "Ebs": { "VolumeSize": "1", "VolumeType": "gp2" }},
					{"DeviceName": "xvdc", "Ebs": { "VolumeSize": "1", "VolumeType": "gp2" }},
					{"DeviceName": "xvdd", "Ebs": { "VolumeSize": "1", "VolumeType": "gp2" }},
					{"DeviceName": "xvde", "Ebs": { "VolumeSize": "100", "VolumeType": "gp2" }},
					{"DeviceName": "xvdf", "Ebs": { "VolumeSize": "100", "VolumeType": "gp2" }}
				],
				"Tags": [
				  { "Key" : "Name", "Value": "ms238cpodsql119" },
				  { "Key" : "Application_Id", "Value" : { "Ref": "ApplicationId" } },
				  { "Key" : "Application_Name", "Value" : { "Ref": "ApplicationName" } },
				  { "Key" : "Environment", "Value" :  { "Ref": "Environment" } },
				  { "Key" : "PO_Number", "Value" : { "Ref": "PONumber" } },
				  { "Key" : "Project_ID", "Value" : { "Ref": "ProjectId" } },
				  { "Key" : "Owner", "Value" : { "Ref": "Owner" } },
				  { "Key" : "Approver", "Value" : { "Ref": "Approver" } }
				],
				"UserData": {
					"Fn::Base64": { "Fn::Join": [ "", [
						"<powershell>\n",
						"$size = (Get-PartitionSupportedSize -DiskNumber 4 -PartitionNumber 2)\n",
						"Resize-Partition -DiskNumber 4 -PartitionNumber 2 -Size $size.SizeMax\n",
						"$size = (Get-PartitionSupportedSize -DiskNumber 5 -PartitionNumber 2)\n",
						"Resize-Partition -DiskNumber 5 -PartitionNumber 2 -Size $size.SizeMax\n",
						"Rename-Computer -NewName ms238cpodsql119 -Restart\n",
						"</powershell>"
					]]}
				}
			}
		},
		"ms238cpodsql120": {
			"Type": "AWS::EC2::Instance",
			"Properties": {
				"AvailabilityZone": "us-east-1d",
				"IamInstanceProfile": "Sysco-ApplicationDefaultInstanceProfile-47RRMF15XFMP",
				"ImageId": "ami-1a659560",
				"InstanceType": "t2.large",
				"KeyName": { "Ref": "PemKey2" },
				"SecurityGroupIds": [{ "Ref": "CPDBSG" }, { "Ref": "NATCLIENT" }, "sg-42dc8b26"],
				"SubnetId": { "Ref": "Conf1d" },
				"BlockDeviceMappings": [
					{"DeviceName": "/dev/sda1", "Ebs": { "VolumeSize": "50", "VolumeType": "gp2" }},
					{"DeviceName": "xvdb", "Ebs": { "VolumeSize": "1", "VolumeType": "gp2" }},
					{"DeviceName": "xvdc", "Ebs": { "VolumeSize": "1", "VolumeType": "gp2" }},
					{"DeviceName": "xvdd", "Ebs": { "VolumeSize": "1", "VolumeType": "gp2" }},
					{"DeviceName": "xvde", "Ebs": { "VolumeSize": "100", "VolumeType": "gp2" }},
					{"DeviceName": "xvdf", "Ebs": { "VolumeSize": "100", "VolumeType": "gp2" }}
				],
				"Tags": [
				  { "Key" : "Name", "Value": "ms238cpodsql120" },
				  { "Key" : "Application_Id", "Value" : { "Ref": "ApplicationId" } },
				  { "Key" : "Application_Name", "Value" : { "Ref": "ApplicationName" } },
				  { "Key" : "Environment", "Value" :  { "Ref": "Environment" } },
				  { "Key" : "PO_Number", "Value" : { "Ref": "PONumber" } },
				  { "Key" : "Project_ID", "Value" : { "Ref": "ProjectId" } },
				  { "Key" : "Owner", "Value" : { "Ref": "Owner" } },
				  { "Key" : "Approver", "Value" : { "Ref": "Approver" } }
				],
				"UserData": {
					"Fn::Base64": { "Fn::Join": [ "", [
						"<powershell>\n",
						"$size = (Get-PartitionSupportedSize -DiskNumber 4 -PartitionNumber 2)\n",
						"Resize-Partition -DiskNumber 4 -PartitionNumber 2 -Size $size.SizeMax\n",
						"$size = (Get-PartitionSupportedSize -DiskNumber 5 -PartitionNumber 2)\n",
						"Resize-Partition -DiskNumber 5 -PartitionNumber 2 -Size $size.SizeMax\n",
						"Rename-Computer -NewName ms238cpodsql120 -Restart\n",
						"</powershell>"
					]]}
				}
			}
		},
		"ms238cpodsql121": {
			"Type": "AWS::EC2::Instance",
			"Properties": {
				"AvailabilityZone": "us-east-1c",
				"IamInstanceProfile": "Sysco-ApplicationDefaultInstanceProfile-47RRMF15XFMP",
				"ImageId": "ami-1a659560",
				"InstanceType": "t2.large",
				"KeyName": { "Ref": "PemKey2" },
				"SecurityGroupIds": [{ "Ref": "CPDBSG" }, { "Ref": "NATCLIENT" }, "sg-42dc8b26"],
				"SubnetId": { "Ref": "Conf1c" },
				"BlockDeviceMappings": [
					{"DeviceName": "/dev/sda1", "Ebs": { "VolumeSize": "50", "VolumeType": "gp2" }},
					{"DeviceName": "xvdb", "Ebs": { "VolumeSize": "1", "VolumeType": "gp2" }},
					{"DeviceName": "xvdc", "Ebs": { "VolumeSize": "1", "VolumeType": "gp2" }},
					{"DeviceName": "xvdd", "Ebs": { "VolumeSize": "1", "VolumeType": "gp2" }},
					{"DeviceName": "xvde", "Ebs": { "VolumeSize": "100", "VolumeType": "gp2" }},
					{"DeviceName": "xvdf", "Ebs": { "VolumeSize": "100", "VolumeType": "gp2" }}
				],
				"Tags": [
				  { "Key" : "Name", "Value": "ms238cpodsql121" },
				  { "Key" : "Application_Id", "Value" : { "Ref": "ApplicationId" } },
				  { "Key" : "Application_Name", "Value" : { "Ref": "ApplicationName" } },
				  { "Key" : "Environment", "Value" :  { "Ref": "Environment" } },
				  { "Key" : "PO_Number", "Value" : { "Ref": "PONumber" } },
				  { "Key" : "Project_ID", "Value" : { "Ref": "ProjectId" } },
				  { "Key" : "Owner", "Value" : { "Ref": "Owner" } },
				  { "Key" : "Approver", "Value" : { "Ref": "Approver" } }
				],
				"UserData": {
					"Fn::Base64": { "Fn::Join": [ "", [
						"<powershell>\n",
						"$size = (Get-PartitionSupportedSize -DiskNumber 4 -PartitionNumber 2)\n",
						"Resize-Partition -DiskNumber 4 -PartitionNumber 2 -Size $size.SizeMax\n",
						"$size = (Get-PartitionSupportedSize -DiskNumber 5 -PartitionNumber 2)\n",
						"Resize-Partition -DiskNumber 5 -PartitionNumber 2 -Size $size.SizeMax\n",
						"Rename-Computer -NewName ms238cpodsql121 -Restart\n",
						"</powershell>"
					]]}
				}
			}
		},
		"ms238cpodsql122": {
			"Type": "AWS::EC2::Instance",
			"Properties": {
				"AvailabilityZone": "us-east-1d",
				"IamInstanceProfile": "Sysco-ApplicationDefaultInstanceProfile-47RRMF15XFMP",
				"ImageId": "ami-1a659560",
				"InstanceType": "t2.large",
				"KeyName": { "Ref": "PemKey2" },
				"SecurityGroupIds": [{ "Ref": "CPDBSG" }, { "Ref": "NATCLIENT" }, "sg-42dc8b26"],
				"SubnetId": { "Ref": "Conf1d" },
				"BlockDeviceMappings": [
					{"DeviceName": "/dev/sda1", "Ebs": { "VolumeSize": "50", "VolumeType": "gp2" }},
					{"DeviceName": "xvdb", "Ebs": { "VolumeSize": "1", "VolumeType": "gp2" }},
					{"DeviceName": "xvdc", "Ebs": { "VolumeSize": "1", "VolumeType": "gp2" }},
					{"DeviceName": "xvdd", "Ebs": { "VolumeSize": "1", "VolumeType": "gp2" }},
					{"DeviceName": "xvde", "Ebs": { "VolumeSize": "100", "VolumeType": "gp2" }},
					{"DeviceName": "xvdf", "Ebs": { "VolumeSize": "100", "VolumeType": "gp2" }}
				],
				"Tags": [
				  { "Key" : "Name", "Value": "ms238cpodsql122" },
				  { "Key" : "Application_Id", "Value" : { "Ref": "ApplicationId" } },
				  { "Key" : "Application_Name", "Value" : { "Ref": "ApplicationName" } },
				  { "Key" : "Environment", "Value" :  { "Ref": "Environment" } },
				  { "Key" : "PO_Number", "Value" : { "Ref": "PONumber" } },
				  { "Key" : "Project_ID", "Value" : { "Ref": "ProjectId" } },
				  { "Key" : "Owner", "Value" : { "Ref": "Owner" } },
				  { "Key" : "Approver", "Value" : { "Ref": "Approver" } }
				],
				"UserData": {
					"Fn::Base64": { "Fn::Join": [ "", [
						"<powershell>\n",
						"$size = (Get-PartitionSupportedSize -DiskNumber 4 -PartitionNumber 2)\n",
						"Resize-Partition -DiskNumber 4 -PartitionNumber 2 -Size $size.SizeMax\n",
						"$size = (Get-PartitionSupportedSize -DiskNumber 5 -PartitionNumber 2)\n",
						"Resize-Partition -DiskNumber 5 -PartitionNumber 2 -Size $size.SizeMax\n",
						"Rename-Computer -NewName ms238cpodsql122 -Restart\n",
						"</powershell>"
					]]}
				}
			}
		},
		"ms238cpodsql123": {
			"Type": "AWS::EC2::Instance",
			"Properties": {
				"AvailabilityZone": "us-east-1c",
				"IamInstanceProfile": "Sysco-ApplicationDefaultInstanceProfile-47RRMF15XFMP",
				"ImageId": "ami-1a659560",
				"InstanceType": "t2.large",
				"KeyName": { "Ref": "PemKey2" },
				"SecurityGroupIds": [{ "Ref": "CPDBSG" }, { "Ref": "NATCLIENT" }, "sg-42dc8b26"],
				"SubnetId": { "Ref": "Conf1c" },
				"BlockDeviceMappings": [
					{"DeviceName": "/dev/sda1", "Ebs": { "VolumeSize": "50", "VolumeType": "gp2" }},
					{"DeviceName": "xvdb", "Ebs": { "VolumeSize": "1", "VolumeType": "gp2" }},
					{"DeviceName": "xvdc", "Ebs": { "VolumeSize": "1", "VolumeType": "gp2" }},
					{"DeviceName": "xvdd", "Ebs": { "VolumeSize": "1", "VolumeType": "gp2" }},
					{"DeviceName": "xvde", "Ebs": { "VolumeSize": "100", "VolumeType": "gp2" }},
					{"DeviceName": "xvdf", "Ebs": { "VolumeSize": "100", "VolumeType": "gp2" }}
				],
				"Tags": [
				  { "Key" : "Name", "Value": "ms238cpodsql123" },
				  { "Key" : "Application_Id", "Value" : { "Ref": "ApplicationId" } },
				  { "Key" : "Application_Name", "Value" : { "Ref": "ApplicationName" } },
				  { "Key" : "Environment", "Value" :  { "Ref": "Environment" } },
				  { "Key" : "PO_Number", "Value" : { "Ref": "PONumber" } },
				  { "Key" : "Project_ID", "Value" : { "Ref": "ProjectId" } },
				  { "Key" : "Owner", "Value" : { "Ref": "Owner" } },
				  { "Key" : "Approver", "Value" : { "Ref": "Approver" } }
				],
				"UserData": {
					"Fn::Base64": { "Fn::Join": [ "", [
						"<powershell>\n",
						"$size = (Get-PartitionSupportedSize -DiskNumber 4 -PartitionNumber 2)\n",
						"Resize-Partition -DiskNumber 4 -PartitionNumber 2 -Size $size.SizeMax\n",
						"$size = (Get-PartitionSupportedSize -DiskNumber 5 -PartitionNumber 2)\n",
						"Resize-Partition -DiskNumber 5 -PartitionNumber 2 -Size $size.SizeMax\n",
						"Rename-Computer -NewName ms238cpodsql123 -Restart\n",
						"</powershell>"
					]]}
				}
			}
		},
		"ms238cpodsql124": {
			"Type": "AWS::EC2::Instance",
			"Properties": {
				"AvailabilityZone": "us-east-1d",
				"IamInstanceProfile": "Sysco-ApplicationDefaultInstanceProfile-47RRMF15XFMP",
				"ImageId": "ami-1a659560",
				"InstanceType": "t2.large",
				"KeyName": { "Ref": "PemKey2" },
				"SecurityGroupIds": [{ "Ref": "CPDBSG" }, { "Ref": "NATCLIENT" }, "sg-42dc8b26"],
				"SubnetId": { "Ref": "Conf1d" },
				"BlockDeviceMappings": [
					{"DeviceName": "/dev/sda1", "Ebs": { "VolumeSize": "50", "VolumeType": "gp2" }},
					{"DeviceName": "xvdb", "Ebs": { "VolumeSize": "1", "VolumeType": "gp2" }},
					{"DeviceName": "xvdc", "Ebs": { "VolumeSize": "1", "VolumeType": "gp2" }},
					{"DeviceName": "xvdd", "Ebs": { "VolumeSize": "1", "VolumeType": "gp2" }},
					{"DeviceName": "xvde", "Ebs": { "VolumeSize": "100", "VolumeType": "gp2" }},
					{"DeviceName": "xvdf", "Ebs": { "VolumeSize": "100", "VolumeType": "gp2" }}
				],
				"Tags": [
				  { "Key" : "Name", "Value": "ms238cpodsql124" },
				  { "Key" : "Application_Id", "Value" : { "Ref": "ApplicationId" } },
				  { "Key" : "Application_Name", "Value" : { "Ref": "ApplicationName" } },
				  { "Key" : "Environment", "Value" :  { "Ref": "Environment" } },
				  { "Key" : "PO_Number", "Value" : { "Ref": "PONumber" } },
				  { "Key" : "Project_ID", "Value" : { "Ref": "ProjectId" } },
				  { "Key" : "Owner", "Value" : { "Ref": "Owner" } },
				  { "Key" : "Approver", "Value" : { "Ref": "Approver" } }
				],
				"UserData": {
					"Fn::Base64": { "Fn::Join": [ "", [
						"<powershell>\n",
						"$size = (Get-PartitionSupportedSize -DiskNumber 4 -PartitionNumber 2)\n",
						"Resize-Partition -DiskNumber 4 -PartitionNumber 2 -Size $size.SizeMax\n",
						"$size = (Get-PartitionSupportedSize -DiskNumber 5 -PartitionNumber 2)\n",
						"Resize-Partition -DiskNumber 5 -PartitionNumber 2 -Size $size.SizeMax\n",
						"Rename-Computer -NewName ms238cpodsql124 -Restart\n",
						"</powershell>"
					]]}
				}
			}
		},
		"ms238cpodsql125": {
			"Type": "AWS::EC2::Instance",
			"Properties": {
				"AvailabilityZone": "us-east-1c",
				"IamInstanceProfile": "Sysco-ApplicationDefaultInstanceProfile-47RRMF15XFMP",
				"ImageId": "ami-1a659560",
				"InstanceType": "t2.large",
				"KeyName": { "Ref": "PemKey2" },
				"SecurityGroupIds": [{ "Ref": "CPDBSG" }, { "Ref": "NATCLIENT" }, "sg-42dc8b26"],
				"SubnetId": { "Ref": "Conf1c" },
				"BlockDeviceMappings": [
					{"DeviceName": "/dev/sda1", "Ebs": { "VolumeSize": "50", "VolumeType": "gp2" }},
					{"DeviceName": "xvdb", "Ebs": { "VolumeSize": "1", "VolumeType": "gp2" }},
					{"DeviceName": "xvdc", "Ebs": { "VolumeSize": "1", "VolumeType": "gp2" }},
					{"DeviceName": "xvdd", "Ebs": { "VolumeSize": "1", "VolumeType": "gp2" }},
					{"DeviceName": "xvde", "Ebs": { "VolumeSize": "100", "VolumeType": "gp2" }},
					{"DeviceName": "xvdf", "Ebs": { "VolumeSize": "100", "VolumeType": "gp2" }}
				],
				"Tags": [
				  { "Key" : "Name", "Value": "ms238cpodsql125" },
				  { "Key" : "Application_Id", "Value" : { "Ref": "ApplicationId" } },
				  { "Key" : "Application_Name", "Value" : { "Ref": "ApplicationName" } },
				  { "Key" : "Environment", "Value" :  { "Ref": "Environment" } },
				  { "Key" : "PO_Number", "Value" : { "Ref": "PONumber" } },
				  { "Key" : "Project_ID", "Value" : { "Ref": "ProjectId" } },
				  { "Key" : "Owner", "Value" : { "Ref": "Owner" } },
				  { "Key" : "Approver", "Value" : { "Ref": "Approver" } }
				],
				"UserData": {
					"Fn::Base64": { "Fn::Join": [ "", [
						"<powershell>\n",
						"$size = (Get-PartitionSupportedSize -DiskNumber 4 -PartitionNumber 2)\n",
						"Resize-Partition -DiskNumber 4 -PartitionNumber 2 -Size $size.SizeMax\n",
						"$size = (Get-PartitionSupportedSize -DiskNumber 5 -PartitionNumber 2)\n",
						"Resize-Partition -DiskNumber 5 -PartitionNumber 2 -Size $size.SizeMax\n",
						"Rename-Computer -NewName ms238cpodsql125 -Restart\n",
						"</powershell>"
					]]}
				}
			}
		},
		"ms238cpodsql126": {
			"Type": "AWS::EC2::Instance",
			"Properties": {
				"AvailabilityZone": "us-east-1d",
				"IamInstanceProfile": "Sysco-ApplicationDefaultInstanceProfile-47RRMF15XFMP",
				"ImageId": "ami-1a659560",
				"InstanceType": "t2.large",
				"KeyName": { "Ref": "PemKey2" },
				"SecurityGroupIds": [{ "Ref": "CPDBSG" }, { "Ref": "NATCLIENT" }, "sg-42dc8b26"],
				"SubnetId": { "Ref": "Conf1d" },
				"BlockDeviceMappings": [
					{"DeviceName": "/dev/sda1", "Ebs": { "VolumeSize": "50", "VolumeType": "gp2" }},
					{"DeviceName": "xvdb", "Ebs": { "VolumeSize": "1", "VolumeType": "gp2" }},
					{"DeviceName": "xvdc", "Ebs": { "VolumeSize": "1", "VolumeType": "gp2" }},
					{"DeviceName": "xvdd", "Ebs": { "VolumeSize": "1", "VolumeType": "gp2" }},
					{"DeviceName": "xvde", "Ebs": { "VolumeSize": "100", "VolumeType": "gp2" }},
					{"DeviceName": "xvdf", "Ebs": { "VolumeSize": "100", "VolumeType": "gp2" }}
				],
				"Tags": [
				  { "Key" : "Name", "Value": "ms238cpodsql126" },
				  { "Key" : "Application_Id", "Value" : { "Ref": "ApplicationId" } },
				  { "Key" : "Application_Name", "Value" : { "Ref": "ApplicationName" } },
				  { "Key" : "Environment", "Value" :  { "Ref": "Environment" } },
				  { "Key" : "PO_Number", "Value" : { "Ref": "PONumber" } },
				  { "Key" : "Project_ID", "Value" : { "Ref": "ProjectId" } },
				  { "Key" : "Owner", "Value" : { "Ref": "Owner" } },
				  { "Key" : "Approver", "Value" : { "Ref": "Approver" } }
				],
				"UserData": {
					"Fn::Base64": { "Fn::Join": [ "", [
						"<powershell>\n",
						"$size = (Get-PartitionSupportedSize -DiskNumber 4 -PartitionNumber 2)\n",
						"Resize-Partition -DiskNumber 4 -PartitionNumber 2 -Size $size.SizeMax\n",
						"$size = (Get-PartitionSupportedSize -DiskNumber 5 -PartitionNumber 2)\n",
						"Resize-Partition -DiskNumber 5 -PartitionNumber 2 -Size $size.SizeMax\n",
						"Rename-Computer -NewName ms238cpodsql126 -Restart\n",
						"</powershell>"
					]]}
				}
			}
		},
		"ms238cpodsql127": {
			"Type": "AWS::EC2::Instance",
			"Properties": {
				"AvailabilityZone": "us-east-1c",
				"IamInstanceProfile": "Sysco-ApplicationDefaultInstanceProfile-47RRMF15XFMP",
				"ImageId": "ami-1a659560",
				"InstanceType": "t2.large",
				"KeyName": { "Ref": "PemKey2" },
				"SecurityGroupIds": [{ "Ref": "CPDBSG" }, { "Ref": "NATCLIENT" }, "sg-42dc8b26"],
				"SubnetId": { "Ref": "Conf1c" },
				"BlockDeviceMappings": [
					{"DeviceName": "/dev/sda1", "Ebs": { "VolumeSize": "50", "VolumeType": "gp2" }},
					{"DeviceName": "xvdb", "Ebs": { "VolumeSize": "1", "VolumeType": "gp2" }},
					{"DeviceName": "xvdc", "Ebs": { "VolumeSize": "1", "VolumeType": "gp2" }},
					{"DeviceName": "xvdd", "Ebs": { "VolumeSize": "1", "VolumeType": "gp2" }},
					{"DeviceName": "xvde", "Ebs": { "VolumeSize": "100", "VolumeType": "gp2" }},
					{"DeviceName": "xvdf", "Ebs": { "VolumeSize": "100", "VolumeType": "gp2" }}
				],
				"Tags": [
				  { "Key" : "Name", "Value": "ms238cpodsql127" },
				  { "Key" : "Application_Id", "Value" : { "Ref": "ApplicationId" } },
				  { "Key" : "Application_Name", "Value" : { "Ref": "ApplicationName" } },
				  { "Key" : "Environment", "Value" :  { "Ref": "Environment" } },
				  { "Key" : "PO_Number", "Value" : { "Ref": "PONumber" } },
				  { "Key" : "Project_ID", "Value" : { "Ref": "ProjectId" } },
				  { "Key" : "Owner", "Value" : { "Ref": "Owner" } },
				  { "Key" : "Approver", "Value" : { "Ref": "Approver" } }
				],
				"UserData": {
					"Fn::Base64": { "Fn::Join": [ "", [
						"<powershell>\n",
						"$size = (Get-PartitionSupportedSize -DiskNumber 4 -PartitionNumber 2)\n",
						"Resize-Partition -DiskNumber 4 -PartitionNumber 2 -Size $size.SizeMax\n",
						"$size = (Get-PartitionSupportedSize -DiskNumber 5 -PartitionNumber 2)\n",
						"Resize-Partition -DiskNumber 5 -PartitionNumber 2 -Size $size.SizeMax\n",
						"Rename-Computer -NewName ms238cpodsql127 -Restart\n",
						"</powershell>"
					]]}
				}
			}
		},
		"ms238cpodsql128": {
			"Type": "AWS::EC2::Instance",
			"Properties": {
				"AvailabilityZone": "us-east-1d",
				"IamInstanceProfile": "Sysco-ApplicationDefaultInstanceProfile-47RRMF15XFMP",
				"ImageId": "ami-1a659560",
				"InstanceType": "t2.large",
				"KeyName": { "Ref": "PemKey2" },
				"SecurityGroupIds": [{ "Ref": "CPDBSG" }, { "Ref": "NATCLIENT" }, "sg-42dc8b26"],
				"SubnetId": { "Ref": "Conf1d" },
				"BlockDeviceMappings": [
					{"DeviceName": "/dev/sda1", "Ebs": { "VolumeSize": "50", "VolumeType": "gp2" }},
					{"DeviceName": "xvdb", "Ebs": { "VolumeSize": "1", "VolumeType": "gp2" }},
					{"DeviceName": "xvdc", "Ebs": { "VolumeSize": "1", "VolumeType": "gp2" }},
					{"DeviceName": "xvdd", "Ebs": { "VolumeSize": "1", "VolumeType": "gp2" }},
					{"DeviceName": "xvde", "Ebs": { "VolumeSize": "100", "VolumeType": "gp2" }},
					{"DeviceName": "xvdf", "Ebs": { "VolumeSize": "100", "VolumeType": "gp2" }}
				],
				"Tags": [
				  { "Key" : "Name", "Value": "ms238cpodsql128" },
				  { "Key" : "Application_Id", "Value" : { "Ref": "ApplicationId" } },
				  { "Key" : "Application_Name", "Value" : { "Ref": "ApplicationName" } },
				  { "Key" : "Environment", "Value" :  { "Ref": "Environment" } },
				  { "Key" : "PO_Number", "Value" : { "Ref": "PONumber" } },
				  { "Key" : "Project_ID", "Value" : { "Ref": "ProjectId" } },
				  { "Key" : "Owner", "Value" : { "Ref": "Owner" } },
				  { "Key" : "Approver", "Value" : { "Ref": "Approver" } }
				],
				"UserData": {
					"Fn::Base64": { "Fn::Join": [ "", [
						"<powershell>\n",
						"$size = (Get-PartitionSupportedSize -DiskNumber 4 -PartitionNumber 2)\n",
						"Resize-Partition -DiskNumber 4 -PartitionNumber 2 -Size $size.SizeMax\n",
						"$size = (Get-PartitionSupportedSize -DiskNumber 5 -PartitionNumber 2)\n",
						"Resize-Partition -DiskNumber 5 -PartitionNumber 2 -Size $size.SizeMax\n",
						"Rename-Computer -NewName ms238cpodsql128 -Restart\n",
						"</powershell>"
					]]}
				}
			}
		},
		"ms238cpodsql129": {
			"Type": "AWS::EC2::Instance",
			"Properties": {
				"AvailabilityZone": "us-east-1c",
				"IamInstanceProfile": "Sysco-ApplicationDefaultInstanceProfile-47RRMF15XFMP",
				"ImageId": "ami-1a659560",
				"InstanceType": "t2.large",
				"KeyName": { "Ref": "PemKey2" },
				"SecurityGroupIds": [{ "Ref": "CPDBSG" }, { "Ref": "NATCLIENT" }, "sg-42dc8b26"],
				"SubnetId": { "Ref": "Conf1c" },
				"BlockDeviceMappings": [
					{"DeviceName": "/dev/sda1", "Ebs": { "VolumeSize": "50", "VolumeType": "gp2" }},
					{"DeviceName": "xvdb", "Ebs": { "VolumeSize": "1", "VolumeType": "gp2" }},
					{"DeviceName": "xvdc", "Ebs": { "VolumeSize": "1", "VolumeType": "gp2" }},
					{"DeviceName": "xvdd", "Ebs": { "VolumeSize": "1", "VolumeType": "gp2" }},
					{"DeviceName": "xvde", "Ebs": { "VolumeSize": "100", "VolumeType": "gp2" }},
					{"DeviceName": "xvdf", "Ebs": { "VolumeSize": "100", "VolumeType": "gp2" }}
				],
				"Tags": [
				  { "Key" : "Name", "Value": "ms238cpodsql129" },
				  { "Key" : "Application_Id", "Value" : { "Ref": "ApplicationId" } },
				  { "Key" : "Application_Name", "Value" : { "Ref": "ApplicationName" } },
				  { "Key" : "Environment", "Value" :  { "Ref": "Environment" } },
				  { "Key" : "PO_Number", "Value" : { "Ref": "PONumber" } },
				  { "Key" : "Project_ID", "Value" : { "Ref": "ProjectId" } },
				  { "Key" : "Owner", "Value" : { "Ref": "Owner" } },
				  { "Key" : "Approver", "Value" : { "Ref": "Approver" } }
				],
				"UserData": {
					"Fn::Base64": { "Fn::Join": [ "", [
						"<powershell>\n",
						"$size = (Get-PartitionSupportedSize -DiskNumber 4 -PartitionNumber 2)\n",
						"Resize-Partition -DiskNumber 4 -PartitionNumber 2 -Size $size.SizeMax\n",
						"$size = (Get-PartitionSupportedSize -DiskNumber 5 -PartitionNumber 2)\n",
						"Resize-Partition -DiskNumber 5 -PartitionNumber 2 -Size $size.SizeMax\n",
						"Rename-Computer -NewName ms238cpodsql129 -Restart\n",
						"</powershell>"
					]]}
				}
			}
		},
		"ms238cpodsql130": {
			"Type": "AWS::EC2::Instance",
			"Properties": {
				"AvailabilityZone": "us-east-1d",
				"IamInstanceProfile": "Sysco-ApplicationDefaultInstanceProfile-47RRMF15XFMP",
				"ImageId": "ami-1a659560",
				"InstanceType": "t2.large",
				"KeyName": { "Ref": "PemKey2" },
				"SecurityGroupIds": [{ "Ref": "CPDBSG" }, { "Ref": "NATCLIENT" }, "sg-42dc8b26"],
				"SubnetId": { "Ref": "Conf1d" },
				"BlockDeviceMappings": [
					{"DeviceName": "/dev/sda1", "Ebs": { "VolumeSize": "50", "VolumeType": "gp2" }},
					{"DeviceName": "xvdb", "Ebs": { "VolumeSize": "1", "VolumeType": "gp2" }},
					{"DeviceName": "xvdc", "Ebs": { "VolumeSize": "1", "VolumeType": "gp2" }},
					{"DeviceName": "xvdd", "Ebs": { "VolumeSize": "1", "VolumeType": "gp2" }},
					{"DeviceName": "xvde", "Ebs": { "VolumeSize": "100", "VolumeType": "gp2" }},
					{"DeviceName": "xvdf", "Ebs": { "VolumeSize": "100", "VolumeType": "gp2" }}
				],
				"Tags": [
				  { "Key" : "Name", "Value": "ms238cpodsql130" },
				  { "Key" : "Application_Id", "Value" : { "Ref": "ApplicationId" } },
				  { "Key" : "Application_Name", "Value" : { "Ref": "ApplicationName" } },
				  { "Key" : "Environment", "Value" :  { "Ref": "Environment" } },
				  { "Key" : "PO_Number", "Value" : { "Ref": "PONumber" } },
				  { "Key" : "Project_ID", "Value" : { "Ref": "ProjectId" } },
				  { "Key" : "Owner", "Value" : { "Ref": "Owner" } },
				  { "Key" : "Approver", "Value" : { "Ref": "Approver" } }
				],
				"UserData": {
					"Fn::Base64": { "Fn::Join": [ "", [
						"<powershell>\n",
						"$size = (Get-PartitionSupportedSize -DiskNumber 4 -PartitionNumber 2)\n",
						"Resize-Partition -DiskNumber 4 -PartitionNumber 2 -Size $size.SizeMax\n",
						"$size = (Get-PartitionSupportedSize -DiskNumber 5 -PartitionNumber 2)\n",
						"Resize-Partition -DiskNumber 5 -PartitionNumber 2 -Size $size.SizeMax\n",
						"Rename-Computer -NewName ms238cpodsql130 -Restart\n",
						"</powershell>"
					]]}
				}
			}
		},
		"ms238cpodsql131": {
			"Type": "AWS::EC2::Instance",
			"Properties": {
				"AvailabilityZone": "us-east-1c",
				"IamInstanceProfile": "Sysco-ApplicationDefaultInstanceProfile-47RRMF15XFMP",
				"ImageId": "ami-1a659560",
				"InstanceType": "t2.large",
				"KeyName": { "Ref": "PemKey2" },
				"SecurityGroupIds": [{ "Ref": "CPDBSG" }, { "Ref": "NATCLIENT" }, "sg-42dc8b26"],
				"SubnetId": { "Ref": "Conf1c" },
				"BlockDeviceMappings": [
					{"DeviceName": "/dev/sda1", "Ebs": { "VolumeSize": "50", "VolumeType": "gp2" }},
					{"DeviceName": "xvdb", "Ebs": { "VolumeSize": "1", "VolumeType": "gp2" }},
					{"DeviceName": "xvdc", "Ebs": { "VolumeSize": "1", "VolumeType": "gp2" }},
					{"DeviceName": "xvdd", "Ebs": { "VolumeSize": "1", "VolumeType": "gp2" }},
					{"DeviceName": "xvde", "Ebs": { "VolumeSize": "100", "VolumeType": "gp2" }},
					{"DeviceName": "xvdf", "Ebs": { "VolumeSize": "100", "VolumeType": "gp2" }}
				],
				"Tags": [
				  { "Key" : "Name", "Value": "ms238cpodsql131" },
				  { "Key" : "Application_Id", "Value" : { "Ref": "ApplicationId" } },
				  { "Key" : "Application_Name", "Value" : { "Ref": "ApplicationName" } },
				  { "Key" : "Environment", "Value" :  { "Ref": "Environment" } },
				  { "Key" : "PO_Number", "Value" : { "Ref": "PONumber" } },
				  { "Key" : "Project_ID", "Value" : { "Ref": "ProjectId" } },
				  { "Key" : "Owner", "Value" : { "Ref": "Owner" } },
				  { "Key" : "Approver", "Value" : { "Ref": "Approver" } }
				],
				"UserData": {
					"Fn::Base64": { "Fn::Join": [ "", [
						"<powershell>\n",
						"$size = (Get-PartitionSupportedSize -DiskNumber 4 -PartitionNumber 2)\n",
						"Resize-Partition -DiskNumber 4 -PartitionNumber 2 -Size $size.SizeMax\n",
						"$size = (Get-PartitionSupportedSize -DiskNumber 5 -PartitionNumber 2)\n",
						"Resize-Partition -DiskNumber 5 -PartitionNumber 2 -Size $size.SizeMax\n",
						"Rename-Computer -NewName ms238cpodsql131 -Restart\n",
						"</powershell>"
					]]}
				}
			}
		},
		"ms238cpodsql132": {
			"Type": "AWS::EC2::Instance",
			"Properties": {
				"AvailabilityZone": "us-east-1d",
				"IamInstanceProfile": "Sysco-ApplicationDefaultInstanceProfile-47RRMF15XFMP",
				"ImageId": "ami-1a659560",
				"InstanceType": "t2.large",
				"KeyName": { "Ref": "PemKey2" },
				"SecurityGroupIds": [{ "Ref": "CPDBSG" }, { "Ref": "NATCLIENT" }, "sg-42dc8b26"],
				"SubnetId": { "Ref": "Conf1d" },
				"BlockDeviceMappings": [
					{"DeviceName": "/dev/sda1", "Ebs": { "VolumeSize": "50", "VolumeType": "gp2" }},
					{"DeviceName": "xvdb", "Ebs": { "VolumeSize": "1", "VolumeType": "gp2" }},
					{"DeviceName": "xvdc", "Ebs": { "VolumeSize": "1", "VolumeType": "gp2" }},
					{"DeviceName": "xvdd", "Ebs": { "VolumeSize": "1", "VolumeType": "gp2" }},
					{"DeviceName": "xvde", "Ebs": { "VolumeSize": "100", "VolumeType": "gp2" }},
					{"DeviceName": "xvdf", "Ebs": { "VolumeSize": "100", "VolumeType": "gp2" }}
				],
				"Tags": [
				  { "Key" : "Name", "Value": "ms238cpodsql132" },
				  { "Key" : "Application_Id", "Value" : { "Ref": "ApplicationId" } },
				  { "Key" : "Application_Name", "Value" : { "Ref": "ApplicationName" } },
				  { "Key" : "Environment", "Value" :  { "Ref": "Environment" } },
				  { "Key" : "PO_Number", "Value" : { "Ref": "PONumber" } },
				  { "Key" : "Project_ID", "Value" : { "Ref": "ProjectId" } },
				  { "Key" : "Owner", "Value" : { "Ref": "Owner" } },
				  { "Key" : "Approver", "Value" : { "Ref": "Approver" } }
				],
				"UserData": {
					"Fn::Base64": { "Fn::Join": [ "", [
						"<powershell>\n",
						"$size = (Get-PartitionSupportedSize -DiskNumber 4 -PartitionNumber 2)\n",
						"Resize-Partition -DiskNumber 4 -PartitionNumber 2 -Size $size.SizeMax\n",
						"$size = (Get-PartitionSupportedSize -DiskNumber 5 -PartitionNumber 2)\n",
						"Resize-Partition -DiskNumber 5 -PartitionNumber 2 -Size $size.SizeMax\n",
						"Rename-Computer -NewName ms238cpodsql132 -Restart\n",
						"</powershell>"
					]]}
				}
			}
		},
		"ms238cpodsql133": {
			"Type": "AWS::EC2::Instance",
			"Properties": {
				"AvailabilityZone": "us-east-1c",
				"IamInstanceProfile": "Sysco-ApplicationDefaultInstanceProfile-47RRMF15XFMP",
				"ImageId": "ami-1a659560",
				"InstanceType": "t2.large",
				"KeyName": { "Ref": "PemKey2" },
				"SecurityGroupIds": [{ "Ref": "CPDBSG" }, { "Ref": "NATCLIENT" }, "sg-42dc8b26"],
				"SubnetId": { "Ref": "Conf1c" },
				"BlockDeviceMappings": [
					{"DeviceName": "/dev/sda1", "Ebs": { "VolumeSize": "50", "VolumeType": "gp2" }},
					{"DeviceName": "xvdb", "Ebs": { "VolumeSize": "1", "VolumeType": "gp2" }},
					{"DeviceName": "xvdc", "Ebs": { "VolumeSize": "1", "VolumeType": "gp2" }},
					{"DeviceName": "xvdd", "Ebs": { "VolumeSize": "1", "VolumeType": "gp2" }},
					{"DeviceName": "xvde", "Ebs": { "VolumeSize": "100", "VolumeType": "gp2" }},
					{"DeviceName": "xvdf", "Ebs": { "VolumeSize": "100", "VolumeType": "gp2" }}
				],
				"Tags": [
				  { "Key" : "Name", "Value": "ms238cpodsql133" },
				  { "Key" : "Application_Id", "Value" : { "Ref": "ApplicationId" } },
				  { "Key" : "Application_Name", "Value" : { "Ref": "ApplicationName" } },
				  { "Key" : "Environment", "Value" :  { "Ref": "Environment" } },
				  { "Key" : "PO_Number", "Value" : { "Ref": "PONumber" } },
				  { "Key" : "Project_ID", "Value" : { "Ref": "ProjectId" } },
				  { "Key" : "Owner", "Value" : { "Ref": "Owner" } },
				  { "Key" : "Approver", "Value" : { "Ref": "Approver" } }
				],
				"UserData": {
					"Fn::Base64": { "Fn::Join": [ "", [
						"<powershell>\n",
						"$size = (Get-PartitionSupportedSize -DiskNumber 4 -PartitionNumber 2)\n",
						"Resize-Partition -DiskNumber 4 -PartitionNumber 2 -Size $size.SizeMax\n",
						"$size = (Get-PartitionSupportedSize -DiskNumber 5 -PartitionNumber 2)\n",
						"Resize-Partition -DiskNumber 5 -PartitionNumber 2 -Size $size.SizeMax\n",
						"Rename-Computer -NewName ms238cpodsql133 -Restart\n",
						"</powershell>"
					]]}
				}
			}
		},
		"ms238cpodsql134": {
			"Type": "AWS::EC2::Instance",
			"Properties": {
				"AvailabilityZone": "us-east-1d",
				"IamInstanceProfile": "Sysco-ApplicationDefaultInstanceProfile-47RRMF15XFMP",
				"ImageId": "ami-1a659560",
				"InstanceType": "t2.large",
				"KeyName": { "Ref": "PemKey2" },
				"SecurityGroupIds": [{ "Ref": "CPDBSG" }, { "Ref": "NATCLIENT" }, "sg-42dc8b26"],
				"SubnetId": { "Ref": "Conf1d" },
				"BlockDeviceMappings": [
					{"DeviceName": "/dev/sda1", "Ebs": { "VolumeSize": "50", "VolumeType": "gp2" }},
					{"DeviceName": "xvdb", "Ebs": { "VolumeSize": "1", "VolumeType": "gp2" }},
					{"DeviceName": "xvdc", "Ebs": { "VolumeSize": "1", "VolumeType": "gp2" }},
					{"DeviceName": "xvdd", "Ebs": { "VolumeSize": "1", "VolumeType": "gp2" }},
					{"DeviceName": "xvde", "Ebs": { "VolumeSize": "100", "VolumeType": "gp2" }},
					{"DeviceName": "xvdf", "Ebs": { "VolumeSize": "100", "VolumeType": "gp2" }}
				],
				"Tags": [
				  { "Key" : "Name", "Value": "ms238cpodsql134" },
				  { "Key" : "Application_Id", "Value" : { "Ref": "ApplicationId" } },
				  { "Key" : "Application_Name", "Value" : { "Ref": "ApplicationName" } },
				  { "Key" : "Environment", "Value" :  { "Ref": "Environment" } },
				  { "Key" : "PO_Number", "Value" : { "Ref": "PONumber" } },
				  { "Key" : "Project_ID", "Value" : { "Ref": "ProjectId" } },
				  { "Key" : "Owner", "Value" : { "Ref": "Owner" } },
				  { "Key" : "Approver", "Value" : { "Ref": "Approver" } }
				],
				"UserData": {
					"Fn::Base64": { "Fn::Join": [ "", [
						"<powershell>\n",
						"$size = (Get-PartitionSupportedSize -DiskNumber 4 -PartitionNumber 2)\n",
						"Resize-Partition -DiskNumber 4 -PartitionNumber 2 -Size $size.SizeMax\n",
						"$size = (Get-PartitionSupportedSize -DiskNumber 5 -PartitionNumber 2)\n",
						"Resize-Partition -DiskNumber 5 -PartitionNumber 2 -Size $size.SizeMax\n",
						"Rename-Computer -NewName ms238cpodsql134 -Restart\n",
						"</powershell>"
					]]}
				}
			}
		},
		"ms238cpodsql135": {
			"Type": "AWS::EC2::Instance",
			"Properties": {
				"AvailabilityZone": "us-east-1c",
				"IamInstanceProfile": "Sysco-ApplicationDefaultInstanceProfile-47RRMF15XFMP",
				"ImageId": "ami-1a659560",
				"InstanceType": "t2.large",
				"KeyName": { "Ref": "PemKey2" },
				"SecurityGroupIds": [{ "Ref": "CPDBSG" }, { "Ref": "NATCLIENT" }, "sg-42dc8b26"],
				"SubnetId": { "Ref": "Conf1c" },
				"BlockDeviceMappings": [
					{"DeviceName": "/dev/sda1", "Ebs": { "VolumeSize": "50", "VolumeType": "gp2" }},
					{"DeviceName": "xvdb", "Ebs": { "VolumeSize": "1", "VolumeType": "gp2" }},
					{"DeviceName": "xvdc", "Ebs": { "VolumeSize": "1", "VolumeType": "gp2" }},
					{"DeviceName": "xvdd", "Ebs": { "VolumeSize": "1", "VolumeType": "gp2" }},
					{"DeviceName": "xvde", "Ebs": { "VolumeSize": "100", "VolumeType": "gp2" }},
					{"DeviceName": "xvdf", "Ebs": { "VolumeSize": "100", "VolumeType": "gp2" }}
				],
				"Tags": [
				  { "Key" : "Name", "Value": "ms238cpodsql135" },
				  { "Key" : "Application_Id", "Value" : { "Ref": "ApplicationId" } },
				  { "Key" : "Application_Name", "Value" : { "Ref": "ApplicationName" } },
				  { "Key" : "Environment", "Value" :  { "Ref": "Environment" } },
				  { "Key" : "PO_Number", "Value" : { "Ref": "PONumber" } },
				  { "Key" : "Project_ID", "Value" : { "Ref": "ProjectId" } },
				  { "Key" : "Owner", "Value" : { "Ref": "Owner" } },
				  { "Key" : "Approver", "Value" : { "Ref": "Approver" } }
				],
				"UserData": {
					"Fn::Base64": { "Fn::Join": [ "", [
						"<powershell>\n",
						"$size = (Get-PartitionSupportedSize -DiskNumber 4 -PartitionNumber 2)\n",
						"Resize-Partition -DiskNumber 4 -PartitionNumber 2 -Size $size.SizeMax\n",
						"$size = (Get-PartitionSupportedSize -DiskNumber 5 -PartitionNumber 2)\n",
						"Resize-Partition -DiskNumber 5 -PartitionNumber 2 -Size $size.SizeMax\n",
						"Rename-Computer -NewName ms238cpodsql135 -Restart\n",
						"</powershell>"
					]]}
				}
			}
		},
		"ms238cpodsql136": {
			"Type": "AWS::EC2::Instance",
			"Properties": {
				"AvailabilityZone": "us-east-1d",
				"IamInstanceProfile": "Sysco-ApplicationDefaultInstanceProfile-47RRMF15XFMP",
				"ImageId": "ami-1a659560",
				"InstanceType": "t2.large",
				"KeyName": { "Ref": "PemKey2" },
				"SecurityGroupIds": [{ "Ref": "CPDBSG" }, { "Ref": "NATCLIENT" }, "sg-42dc8b26"],
				"SubnetId": { "Ref": "Conf1d" },
				"BlockDeviceMappings": [
					{"DeviceName": "/dev/sda1", "Ebs": { "VolumeSize": "50", "VolumeType": "gp2" }},
					{"DeviceName": "xvdb", "Ebs": { "VolumeSize": "1", "VolumeType": "gp2" }},
					{"DeviceName": "xvdc", "Ebs": { "VolumeSize": "1", "VolumeType": "gp2" }},
					{"DeviceName": "xvdd", "Ebs": { "VolumeSize": "1", "VolumeType": "gp2" }},
					{"DeviceName": "xvde", "Ebs": { "VolumeSize": "100", "VolumeType": "gp2" }},
					{"DeviceName": "xvdf", "Ebs": { "VolumeSize": "100", "VolumeType": "gp2" }}
				],
				"Tags": [
				  { "Key" : "Name", "Value": "ms238cpodsql136" },
				  { "Key" : "Application_Id", "Value" : { "Ref": "ApplicationId" } },
				  { "Key" : "Application_Name", "Value" : { "Ref": "ApplicationName" } },
				  { "Key" : "Environment", "Value" :  { "Ref": "Environment" } },
				  { "Key" : "PO_Number", "Value" : { "Ref": "PONumber" } },
				  { "Key" : "Project_ID", "Value" : { "Ref": "ProjectId" } },
				  { "Key" : "Owner", "Value" : { "Ref": "Owner" } },
				  { "Key" : "Approver", "Value" : { "Ref": "Approver" } }
				],
				"UserData": {
					"Fn::Base64": { "Fn::Join": [ "", [
						"<powershell>\n",
						"$size = (Get-PartitionSupportedSize -DiskNumber 4 -PartitionNumber 2)\n",
						"Resize-Partition -DiskNumber 4 -PartitionNumber 2 -Size $size.SizeMax\n",
						"$size = (Get-PartitionSupportedSize -DiskNumber 5 -PartitionNumber 2)\n",
						"Resize-Partition -DiskNumber 5 -PartitionNumber 2 -Size $size.SizeMax\n",
						"Rename-Computer -NewName ms238cpodsql136 -Restart\n",
						"</powershell>"
					]]}
				}
			}
		},
		"ms238cpodsql137": {
			"Type": "AWS::EC2::Instance",
			"Properties": {
				"AvailabilityZone": "us-east-1c",
				"IamInstanceProfile": "Sysco-ApplicationDefaultInstanceProfile-47RRMF15XFMP",
				"ImageId": "ami-1a659560",
				"InstanceType": "t2.large",
				"KeyName": { "Ref": "PemKey2" },
				"SecurityGroupIds": [{ "Ref": "CPDBSG" }, { "Ref": "NATCLIENT" }, "sg-42dc8b26"],
				"SubnetId": { "Ref": "Conf1c" },
				"BlockDeviceMappings": [
					{"DeviceName": "/dev/sda1", "Ebs": { "VolumeSize": "50", "VolumeType": "gp2" }},
					{"DeviceName": "xvdb", "Ebs": { "VolumeSize": "1", "VolumeType": "gp2" }},
					{"DeviceName": "xvdc", "Ebs": { "VolumeSize": "1", "VolumeType": "gp2" }},
					{"DeviceName": "xvdd", "Ebs": { "VolumeSize": "1", "VolumeType": "gp2" }},
					{"DeviceName": "xvde", "Ebs": { "VolumeSize": "100", "VolumeType": "gp2" }},
					{"DeviceName": "xvdf", "Ebs": { "VolumeSize": "100", "VolumeType": "gp2" }}
				],
				"Tags": [
				  { "Key" : "Name", "Value": "ms238cpodsql137" },
				  { "Key" : "Application_Id", "Value" : { "Ref": "ApplicationId" } },
				  { "Key" : "Application_Name", "Value" : { "Ref": "ApplicationName" } },
				  { "Key" : "Environment", "Value" :  { "Ref": "Environment" } },
				  { "Key" : "PO_Number", "Value" : { "Ref": "PONumber" } },
				  { "Key" : "Project_ID", "Value" : { "Ref": "ProjectId" } },
				  { "Key" : "Owner", "Value" : { "Ref": "Owner" } },
				  { "Key" : "Approver", "Value" : { "Ref": "Approver" } }
				],
				"UserData": {
					"Fn::Base64": { "Fn::Join": [ "", [
						"<powershell>\n",
						"$size = (Get-PartitionSupportedSize -DiskNumber 4 -PartitionNumber 2)\n",
						"Resize-Partition -DiskNumber 4 -PartitionNumber 2 -Size $size.SizeMax\n",
						"$size = (Get-PartitionSupportedSize -DiskNumber 5 -PartitionNumber 2)\n",
						"Resize-Partition -DiskNumber 5 -PartitionNumber 2 -Size $size.SizeMax\n",
						"Rename-Computer -NewName ms238cpodsql137 -Restart\n",
						"</powershell>"
					]]}
				}
			}
		},
		"ms238cpodsql138": {
			"Type": "AWS::EC2::Instance",
			"Properties": {
				"AvailabilityZone": "us-east-1d",
				"IamInstanceProfile": "Sysco-ApplicationDefaultInstanceProfile-47RRMF15XFMP",
				"ImageId": "ami-1a659560",
				"InstanceType": "t2.large",
				"KeyName": { "Ref": "PemKey2" },
				"SecurityGroupIds": [{ "Ref": "CPDBSG" }, { "Ref": "NATCLIENT" }, "sg-42dc8b26"],
				"SubnetId": { "Ref": "Conf1d" },
				"BlockDeviceMappings": [
					{"DeviceName": "/dev/sda1", "Ebs": { "VolumeSize": "50", "VolumeType": "gp2" }},
					{"DeviceName": "xvdb", "Ebs": { "VolumeSize": "1", "VolumeType": "gp2" }},
					{"DeviceName": "xvdc", "Ebs": { "VolumeSize": "1", "VolumeType": "gp2" }},
					{"DeviceName": "xvdd", "Ebs": { "VolumeSize": "1", "VolumeType": "gp2" }},
					{"DeviceName": "xvde", "Ebs": { "VolumeSize": "100", "VolumeType": "gp2" }},
					{"DeviceName": "xvdf", "Ebs": { "VolumeSize": "100", "VolumeType": "gp2" }}
				],
				"Tags": [
				  { "Key" : "Name", "Value": "ms238cpodsql138" },
				  { "Key" : "Application_Id", "Value" : { "Ref": "ApplicationId" } },
				  { "Key" : "Application_Name", "Value" : { "Ref": "ApplicationName" } },
				  { "Key" : "Environment", "Value" :  { "Ref": "Environment" } },
				  { "Key" : "PO_Number", "Value" : { "Ref": "PONumber" } },
				  { "Key" : "Project_ID", "Value" : { "Ref": "ProjectId" } },
				  { "Key" : "Owner", "Value" : { "Ref": "Owner" } },
				  { "Key" : "Approver", "Value" : { "Ref": "Approver" } }
				],
				"UserData": {
					"Fn::Base64": { "Fn::Join": [ "", [
						"<powershell>\n",
						"$size = (Get-PartitionSupportedSize -DiskNumber 4 -PartitionNumber 2)\n",
						"Resize-Partition -DiskNumber 4 -PartitionNumber 2 -Size $size.SizeMax\n",
						"$size = (Get-PartitionSupportedSize -DiskNumber 5 -PartitionNumber 2)\n",
						"Resize-Partition -DiskNumber 5 -PartitionNumber 2 -Size $size.SizeMax\n",
						"Rename-Computer -NewName ms238cpodsql138 -Restart\n",
						"</powershell>"
					]]}
				}
			}
		},
		"ms238cpodsql139": {
			"Type": "AWS::EC2::Instance",
			"Properties": {
				"AvailabilityZone": "us-east-1c",
				"IamInstanceProfile": "Sysco-ApplicationDefaultInstanceProfile-47RRMF15XFMP",
				"ImageId": "ami-1a659560",
				"InstanceType": "t2.large",
				"KeyName": { "Ref": "PemKey2" },
				"SecurityGroupIds": [{ "Ref": "CPDBSG" }, { "Ref": "NATCLIENT" }, "sg-42dc8b26"],
				"SubnetId": { "Ref": "Conf1c" },
				"BlockDeviceMappings": [
					{"DeviceName": "/dev/sda1", "Ebs": { "VolumeSize": "50", "VolumeType": "gp2" }},
					{"DeviceName": "xvdb", "Ebs": { "VolumeSize": "1", "VolumeType": "gp2" }},
					{"DeviceName": "xvdc", "Ebs": { "VolumeSize": "1", "VolumeType": "gp2" }},
					{"DeviceName": "xvdd", "Ebs": { "VolumeSize": "1", "VolumeType": "gp2" }},
					{"DeviceName": "xvde", "Ebs": { "VolumeSize": "100", "VolumeType": "gp2" }},
					{"DeviceName": "xvdf", "Ebs": { "VolumeSize": "100", "VolumeType": "gp2" }}
				],
				"Tags": [
				  { "Key" : "Name", "Value": "ms238cpodsql139" },
				  { "Key" : "Application_Id", "Value" : { "Ref": "ApplicationId" } },
				  { "Key" : "Application_Name", "Value" : { "Ref": "ApplicationName" } },
				  { "Key" : "Environment", "Value" :  { "Ref": "Environment" } },
				  { "Key" : "PO_Number", "Value" : { "Ref": "PONumber" } },
				  { "Key" : "Project_ID", "Value" : { "Ref": "ProjectId" } },
				  { "Key" : "Owner", "Value" : { "Ref": "Owner" } },
				  { "Key" : "Approver", "Value" : { "Ref": "Approver" } }
				],
				"UserData": {
					"Fn::Base64": { "Fn::Join": [ "", [
						"<powershell>\n",
						"$size = (Get-PartitionSupportedSize -DiskNumber 4 -PartitionNumber 2)\n",
						"Resize-Partition -DiskNumber 4 -PartitionNumber 2 -Size $size.SizeMax\n",
						"$size = (Get-PartitionSupportedSize -DiskNumber 5 -PartitionNumber 2)\n",
						"Resize-Partition -DiskNumber 5 -PartitionNumber 2 -Size $size.SizeMax\n",
						"Rename-Computer -NewName ms238cpodsql139 -Restart\n",
						"</powershell>"
					]]}
				}
			}
		},
		"ms238cpodsql140": {
			"Type": "AWS::EC2::Instance",
			"Properties": {
				"AvailabilityZone": "us-east-1d",
				"IamInstanceProfile": "Sysco-ApplicationDefaultInstanceProfile-47RRMF15XFMP",
				"ImageId": "ami-1a659560",
				"InstanceType": "t2.large",
				"KeyName": { "Ref": "PemKey2" },
				"SecurityGroupIds": [{ "Ref": "CPDBSG" }, { "Ref": "NATCLIENT" }, "sg-42dc8b26"],
				"SubnetId": { "Ref": "Conf1d" },
				"BlockDeviceMappings": [
					{"DeviceName": "/dev/sda1", "Ebs": { "VolumeSize": "50", "VolumeType": "gp2" }},
					{"DeviceName": "xvdb", "Ebs": { "VolumeSize": "1", "VolumeType": "gp2" }},
					{"DeviceName": "xvdc", "Ebs": { "VolumeSize": "1", "VolumeType": "gp2" }},
					{"DeviceName": "xvdd", "Ebs": { "VolumeSize": "1", "VolumeType": "gp2" }},
					{"DeviceName": "xvde", "Ebs": { "VolumeSize": "100", "VolumeType": "gp2" }},
					{"DeviceName": "xvdf", "Ebs": { "VolumeSize": "100", "VolumeType": "gp2" }}
				],
				"Tags": [
				  { "Key" : "Name", "Value": "ms238cpodsql140" },
				  { "Key" : "Application_Id", "Value" : { "Ref": "ApplicationId" } },
				  { "Key" : "Application_Name", "Value" : { "Ref": "ApplicationName" } },
				  { "Key" : "Environment", "Value" :  { "Ref": "Environment" } },
				  { "Key" : "PO_Number", "Value" : { "Ref": "PONumber" } },
				  { "Key" : "Project_ID", "Value" : { "Ref": "ProjectId" } },
				  { "Key" : "Owner", "Value" : { "Ref": "Owner" } },
				  { "Key" : "Approver", "Value" : { "Ref": "Approver" } }
				],
				"UserData": {
					"Fn::Base64": { "Fn::Join": [ "", [
						"<powershell>\n",
						"$size = (Get-PartitionSupportedSize -DiskNumber 4 -PartitionNumber 2)\n",
						"Resize-Partition -DiskNumber 4 -PartitionNumber 2 -Size $size.SizeMax\n",
						"$size = (Get-PartitionSupportedSize -DiskNumber 5 -PartitionNumber 2)\n",
						"Resize-Partition -DiskNumber 5 -PartitionNumber 2 -Size $size.SizeMax\n",
						"Rename-Computer -NewName ms238cpodsql140 -Restart\n",
						"</powershell>"
					]]}
				}
			}
		},
		"ms238cpodsql141": {
			"Type": "AWS::EC2::Instance",
			"Properties": {
				"AvailabilityZone": "us-east-1c",
				"IamInstanceProfile": "Sysco-ApplicationDefaultInstanceProfile-47RRMF15XFMP",
				"ImageId": "ami-1a659560",
				"InstanceType": "t2.large",
				"KeyName": { "Ref": "PemKey2" },
				"SecurityGroupIds": [{ "Ref": "CPDBSG" }, { "Ref": "NATCLIENT" }, "sg-42dc8b26"],
				"SubnetId": { "Ref": "Conf1c" },
				"BlockDeviceMappings": [
					{"DeviceName": "/dev/sda1", "Ebs": { "VolumeSize": "50", "VolumeType": "gp2" }},
					{"DeviceName": "xvdb", "Ebs": { "VolumeSize": "1", "VolumeType": "gp2" }},
					{"DeviceName": "xvdc", "Ebs": { "VolumeSize": "1", "VolumeType": "gp2" }},
					{"DeviceName": "xvdd", "Ebs": { "VolumeSize": "1", "VolumeType": "gp2" }},
					{"DeviceName": "xvde", "Ebs": { "VolumeSize": "100", "VolumeType": "gp2" }},
					{"DeviceName": "xvdf", "Ebs": { "VolumeSize": "100", "VolumeType": "gp2" }}
				],
				"Tags": [
				  { "Key" : "Name", "Value": "ms238cpodsql141" },
				  { "Key" : "Application_Id", "Value" : { "Ref": "ApplicationId" } },
				  { "Key" : "Application_Name", "Value" : { "Ref": "ApplicationName" } },
				  { "Key" : "Environment", "Value" :  { "Ref": "Environment" } },
				  { "Key" : "PO_Number", "Value" : { "Ref": "PONumber" } },
				  { "Key" : "Project_ID", "Value" : { "Ref": "ProjectId" } },
				  { "Key" : "Owner", "Value" : { "Ref": "Owner" } },
				  { "Key" : "Approver", "Value" : { "Ref": "Approver" } }
				],
				"UserData": {
					"Fn::Base64": { "Fn::Join": [ "", [
						"<powershell>\n",
						"$size = (Get-PartitionSupportedSize -DiskNumber 4 -PartitionNumber 2)\n",
						"Resize-Partition -DiskNumber 4 -PartitionNumber 2 -Size $size.SizeMax\n",
						"$size = (Get-PartitionSupportedSize -DiskNumber 5 -PartitionNumber 2)\n",
						"Resize-Partition -DiskNumber 5 -PartitionNumber 2 -Size $size.SizeMax\n",
						"Rename-Computer -NewName ms238cpodsql141 -Restart\n",
						"</powershell>"
					]]}
				}
			}
		},
		"ms238cpodsql142": {
			"Type": "AWS::EC2::Instance",
			"Properties": {
				"AvailabilityZone": "us-east-1d",
				"IamInstanceProfile": "Sysco-ApplicationDefaultInstanceProfile-47RRMF15XFMP",
				"ImageId": "ami-1a659560",
				"InstanceType": "t2.large",
				"KeyName": { "Ref": "PemKey2" },
				"SecurityGroupIds": [{ "Ref": "CPDBSG" }, { "Ref": "NATCLIENT" }, "sg-42dc8b26"],
				"SubnetId": { "Ref": "Conf1d" },
				"BlockDeviceMappings": [
					{"DeviceName": "/dev/sda1", "Ebs": { "VolumeSize": "50", "VolumeType": "gp2" }},
					{"DeviceName": "xvdb", "Ebs": { "VolumeSize": "1", "VolumeType": "gp2" }},
					{"DeviceName": "xvdc", "Ebs": { "VolumeSize": "1", "VolumeType": "gp2" }},
					{"DeviceName": "xvdd", "Ebs": { "VolumeSize": "1", "VolumeType": "gp2" }},
					{"DeviceName": "xvde", "Ebs": { "VolumeSize": "100", "VolumeType": "gp2" }},
					{"DeviceName": "xvdf", "Ebs": { "VolumeSize": "100", "VolumeType": "gp2" }}
				],
				"Tags": [
				  { "Key" : "Name", "Value": "ms238cpodsql142" },
				  { "Key" : "Application_Id", "Value" : { "Ref": "ApplicationId" } },
				  { "Key" : "Application_Name", "Value" : { "Ref": "ApplicationName" } },
				  { "Key" : "Environment", "Value" :  { "Ref": "Environment" } },
				  { "Key" : "PO_Number", "Value" : { "Ref": "PONumber" } },
				  { "Key" : "Project_ID", "Value" : { "Ref": "ProjectId" } },
				  { "Key" : "Owner", "Value" : { "Ref": "Owner" } },
				  { "Key" : "Approver", "Value" : { "Ref": "Approver" } }
				],
				"UserData": {
					"Fn::Base64": { "Fn::Join": [ "", [
						"<powershell>\n",
						"$size = (Get-PartitionSupportedSize -DiskNumber 4 -PartitionNumber 2)\n",
						"Resize-Partition -DiskNumber 4 -PartitionNumber 2 -Size $size.SizeMax\n",
						"$size = (Get-PartitionSupportedSize -DiskNumber 5 -PartitionNumber 2)\n",
						"Resize-Partition -DiskNumber 5 -PartitionNumber 2 -Size $size.SizeMax\n",
						"Rename-Computer -NewName ms238cpodsql142 -Restart\n",
						"</powershell>"
					]]}
				}
			}
		},
		"ms238cpodsql143": {
			"Type": "AWS::EC2::Instance",
			"Properties": {
				"AvailabilityZone": "us-east-1c",
				"IamInstanceProfile": "Sysco-ApplicationDefaultInstanceProfile-47RRMF15XFMP",
				"ImageId": "ami-1a659560",
				"InstanceType": "t2.large",
				"KeyName": { "Ref": "PemKey2" },
				"SecurityGroupIds": [{ "Ref": "CPDBSG" }, { "Ref": "NATCLIENT" }, "sg-42dc8b26"],
				"SubnetId": { "Ref": "Conf1c" },
				"BlockDeviceMappings": [
					{"DeviceName": "/dev/sda1", "Ebs": { "VolumeSize": "50", "VolumeType": "gp2" }},
					{"DeviceName": "xvdb", "Ebs": { "VolumeSize": "1", "VolumeType": "gp2" }},
					{"DeviceName": "xvdc", "Ebs": { "VolumeSize": "1", "VolumeType": "gp2" }},
					{"DeviceName": "xvdd", "Ebs": { "VolumeSize": "1", "VolumeType": "gp2" }},
					{"DeviceName": "xvde", "Ebs": { "VolumeSize": "100", "VolumeType": "gp2" }},
					{"DeviceName": "xvdf", "Ebs": { "VolumeSize": "100", "VolumeType": "gp2" }}
				],
				"Tags": [
				  { "Key" : "Name", "Value": "ms238cpodsql143" },
				  { "Key" : "Application_Id", "Value" : { "Ref": "ApplicationId" } },
				  { "Key" : "Application_Name", "Value" : { "Ref": "ApplicationName" } },
				  { "Key" : "Environment", "Value" :  { "Ref": "Environment" } },
				  { "Key" : "PO_Number", "Value" : { "Ref": "PONumber" } },
				  { "Key" : "Project_ID", "Value" : { "Ref": "ProjectId" } },
				  { "Key" : "Owner", "Value" : { "Ref": "Owner" } },
				  { "Key" : "Approver", "Value" : { "Ref": "Approver" } }
				],
				"UserData": {
					"Fn::Base64": { "Fn::Join": [ "", [
						"<powershell>\n",
						"$size = (Get-PartitionSupportedSize -DiskNumber 4 -PartitionNumber 2)\n",
						"Resize-Partition -DiskNumber 4 -PartitionNumber 2 -Size $size.SizeMax\n",
						"$size = (Get-PartitionSupportedSize -DiskNumber 5 -PartitionNumber 2)\n",
						"Resize-Partition -DiskNumber 5 -PartitionNumber 2 -Size $size.SizeMax\n",
						"Rename-Computer -NewName ms238cpodsql143 -Restart\n",
						"</powershell>"
					]]}
				}
			}
		},
		"ms238cpodsql144": {
			"Type": "AWS::EC2::Instance",
			"Properties": {
				"AvailabilityZone": "us-east-1d",
				"IamInstanceProfile": "Sysco-ApplicationDefaultInstanceProfile-47RRMF15XFMP",
				"ImageId": "ami-1a659560",
				"InstanceType": "t2.large",
				"KeyName": { "Ref": "PemKey2" },
				"SecurityGroupIds": [{ "Ref": "CPDBSG" }, { "Ref": "NATCLIENT" }, "sg-42dc8b26"],
				"SubnetId": { "Ref": "Conf1d" },
				"BlockDeviceMappings": [
					{"DeviceName": "/dev/sda1", "Ebs": { "VolumeSize": "50", "VolumeType": "gp2" }},
					{"DeviceName": "xvdb", "Ebs": { "VolumeSize": "1", "VolumeType": "gp2" }},
					{"DeviceName": "xvdc", "Ebs": { "VolumeSize": "1", "VolumeType": "gp2" }},
					{"DeviceName": "xvdd", "Ebs": { "VolumeSize": "1", "VolumeType": "gp2" }},
					{"DeviceName": "xvde", "Ebs": { "VolumeSize": "100", "VolumeType": "gp2" }},
					{"DeviceName": "xvdf", "Ebs": { "VolumeSize": "100", "VolumeType": "gp2" }}
				],
				"Tags": [
				  { "Key" : "Name", "Value": "ms238cpodsql144" },
				  { "Key" : "Application_Id", "Value" : { "Ref": "ApplicationId" } },
				  { "Key" : "Application_Name", "Value" : { "Ref": "ApplicationName" } },
				  { "Key" : "Environment", "Value" :  { "Ref": "Environment" } },
				  { "Key" : "PO_Number", "Value" : { "Ref": "PONumber" } },
				  { "Key" : "Project_ID", "Value" : { "Ref": "ProjectId" } },
				  { "Key" : "Owner", "Value" : { "Ref": "Owner" } },
				  { "Key" : "Approver", "Value" : { "Ref": "Approver" } }
				],
				"UserData": {
					"Fn::Base64": { "Fn::Join": [ "", [
						"<powershell>\n",
						"$size = (Get-PartitionSupportedSize -DiskNumber 4 -PartitionNumber 2)\n",
						"Resize-Partition -DiskNumber 4 -PartitionNumber 2 -Size $size.SizeMax\n",
						"$size = (Get-PartitionSupportedSize -DiskNumber 5 -PartitionNumber 2)\n",
						"Resize-Partition -DiskNumber 5 -PartitionNumber 2 -Size $size.SizeMax\n",
						"Rename-Computer -NewName ms238cpodsql144 -Restart\n",
						"</powershell>"
					]]}
				}
			}
		},
		"ms238cpodsql145": {
			"Type": "AWS::EC2::Instance",
			"Properties": {
				"AvailabilityZone": "us-east-1c",
				"IamInstanceProfile": "Sysco-ApplicationDefaultInstanceProfile-47RRMF15XFMP",
				"ImageId": "ami-1a659560",
				"InstanceType": "t2.large",
				"KeyName": { "Ref": "PemKey2" },
				"SecurityGroupIds": [{ "Ref": "CPDBSG" }, { "Ref": "NATCLIENT" }, "sg-42dc8b26"],
				"SubnetId": { "Ref": "Conf1c" },
				"BlockDeviceMappings": [
					{"DeviceName": "/dev/sda1", "Ebs": { "VolumeSize": "50", "VolumeType": "gp2" }},
					{"DeviceName": "xvdb", "Ebs": { "VolumeSize": "1", "VolumeType": "gp2" }},
					{"DeviceName": "xvdc", "Ebs": { "VolumeSize": "1", "VolumeType": "gp2" }},
					{"DeviceName": "xvdd", "Ebs": { "VolumeSize": "1", "VolumeType": "gp2" }},
					{"DeviceName": "xvde", "Ebs": { "VolumeSize": "100", "VolumeType": "gp2" }},
					{"DeviceName": "xvdf", "Ebs": { "VolumeSize": "100", "VolumeType": "gp2" }}
				],
				"Tags": [
				  { "Key" : "Name", "Value": "ms238cpodsql145" },
				  { "Key" : "Application_Id", "Value" : { "Ref": "ApplicationId" } },
				  { "Key" : "Application_Name", "Value" : { "Ref": "ApplicationName" } },
				  { "Key" : "Environment", "Value" :  { "Ref": "Environment" } },
				  { "Key" : "PO_Number", "Value" : { "Ref": "PONumber" } },
				  { "Key" : "Project_ID", "Value" : { "Ref": "ProjectId" } },
				  { "Key" : "Owner", "Value" : { "Ref": "Owner" } },
				  { "Key" : "Approver", "Value" : { "Ref": "Approver" } }
				],
				"UserData": {
					"Fn::Base64": { "Fn::Join": [ "", [
						"<powershell>\n",
						"$size = (Get-PartitionSupportedSize -DiskNumber 4 -PartitionNumber 2)\n",
						"Resize-Partition -DiskNumber 4 -PartitionNumber 2 -Size $size.SizeMax\n",
						"$size = (Get-PartitionSupportedSize -DiskNumber 5 -PartitionNumber 2)\n",
						"Resize-Partition -DiskNumber 5 -PartitionNumber 2 -Size $size.SizeMax\n",
						"Rename-Computer -NewName ms238cpodsql145 -Restart\n",
						"</powershell>"
					]]}
				}
			}
		},
		"ms238cpodsql146": {
			"Type": "AWS::EC2::Instance",
			"Properties": {
				"AvailabilityZone": "us-east-1d",
				"IamInstanceProfile": "Sysco-ApplicationDefaultInstanceProfile-47RRMF15XFMP",
				"ImageId": "ami-1a659560",
				"InstanceType": "t2.large",
				"KeyName": { "Ref": "PemKey2" },
				"SecurityGroupIds": [{ "Ref": "CPDBSG" }, { "Ref": "NATCLIENT" }, "sg-42dc8b26"],
				"SubnetId": { "Ref": "Conf1d" },
				"BlockDeviceMappings": [
					{"DeviceName": "/dev/sda1", "Ebs": { "VolumeSize": "50", "VolumeType": "gp2" }},
					{"DeviceName": "xvdb", "Ebs": { "VolumeSize": "1", "VolumeType": "gp2" }},
					{"DeviceName": "xvdc", "Ebs": { "VolumeSize": "1", "VolumeType": "gp2" }},
					{"DeviceName": "xvdd", "Ebs": { "VolumeSize": "1", "VolumeType": "gp2" }},
					{"DeviceName": "xvde", "Ebs": { "VolumeSize": "100", "VolumeType": "gp2" }},
					{"DeviceName": "xvdf", "Ebs": { "VolumeSize": "100", "VolumeType": "gp2" }}
				],
				"Tags": [
				  { "Key" : "Name", "Value": "ms238cpodsql146" },
				  { "Key" : "Application_Id", "Value" : { "Ref": "ApplicationId" } },
				  { "Key" : "Application_Name", "Value" : { "Ref": "ApplicationName" } },
				  { "Key" : "Environment", "Value" :  { "Ref": "Environment" } },
				  { "Key" : "PO_Number", "Value" : { "Ref": "PONumber" } },
				  { "Key" : "Project_ID", "Value" : { "Ref": "ProjectId" } },
				  { "Key" : "Owner", "Value" : { "Ref": "Owner" } },
				  { "Key" : "Approver", "Value" : { "Ref": "Approver" } }
				],
				"UserData": {
					"Fn::Base64": { "Fn::Join": [ "", [
						"<powershell>\n",
						"$size = (Get-PartitionSupportedSize -DiskNumber 4 -PartitionNumber 2)\n",
						"Resize-Partition -DiskNumber 4 -PartitionNumber 2 -Size $size.SizeMax\n",
						"$size = (Get-PartitionSupportedSize -DiskNumber 5 -PartitionNumber 2)\n",
						"Resize-Partition -DiskNumber 5 -PartitionNumber 2 -Size $size.SizeMax\n",
						"Rename-Computer -NewName ms238cpodsql146 -Restart\n",
						"</powershell>"
					]]}
				}
			}
		},
		"ms238cpodsql147": {
			"Type": "AWS::EC2::Instance",
			"Properties": {
				"AvailabilityZone": "us-east-1c",
				"IamInstanceProfile": "Sysco-ApplicationDefaultInstanceProfile-47RRMF15XFMP",
				"ImageId": "ami-1a659560",
				"InstanceType": "t2.large",
				"KeyName": { "Ref": "PemKey2" },
				"SecurityGroupIds": [{ "Ref": "CPDBSG" }, { "Ref": "NATCLIENT" }, "sg-42dc8b26"],
				"SubnetId": { "Ref": "Conf1c" },
				"BlockDeviceMappings": [
					{"DeviceName": "/dev/sda1", "Ebs": { "VolumeSize": "50", "VolumeType": "gp2" }},
					{"DeviceName": "xvdb", "Ebs": { "VolumeSize": "1", "VolumeType": "gp2" }},
					{"DeviceName": "xvdc", "Ebs": { "VolumeSize": "1", "VolumeType": "gp2" }},
					{"DeviceName": "xvdd", "Ebs": { "VolumeSize": "1", "VolumeType": "gp2" }},
					{"DeviceName": "xvde", "Ebs": { "VolumeSize": "100", "VolumeType": "gp2" }},
					{"DeviceName": "xvdf", "Ebs": { "VolumeSize": "100", "VolumeType": "gp2" }}
				],
				"Tags": [
				  { "Key" : "Name", "Value": "ms238cpodsql147" },
				  { "Key" : "Application_Id", "Value" : { "Ref": "ApplicationId" } },
				  { "Key" : "Application_Name", "Value" : { "Ref": "ApplicationName" } },
				  { "Key" : "Environment", "Value" :  { "Ref": "Environment" } },
				  { "Key" : "PO_Number", "Value" : { "Ref": "PONumber" } },
				  { "Key" : "Project_ID", "Value" : { "Ref": "ProjectId" } },
				  { "Key" : "Owner", "Value" : { "Ref": "Owner" } },
				  { "Key" : "Approver", "Value" : { "Ref": "Approver" } }
				],
				"UserData": {
					"Fn::Base64": { "Fn::Join": [ "", [
						"<powershell>\n",
						"$size = (Get-PartitionSupportedSize -DiskNumber 4 -PartitionNumber 2)\n",
						"Resize-Partition -DiskNumber 4 -PartitionNumber 2 -Size $size.SizeMax\n",
						"$size = (Get-PartitionSupportedSize -DiskNumber 5 -PartitionNumber 2)\n",
						"Resize-Partition -DiskNumber 5 -PartitionNumber 2 -Size $size.SizeMax\n",
						"Rename-Computer -NewName ms238cpodsql147 -Restart\n",
						"</powershell>"
					]]}
				}
			}
		},
		"ms238cpodsql148": {
			"Type": "AWS::EC2::Instance",
			"Properties": {
				"AvailabilityZone": "us-east-1d",
				"IamInstanceProfile": "Sysco-ApplicationDefaultInstanceProfile-47RRMF15XFMP",
				"ImageId": "ami-1a659560",
				"InstanceType": "t2.large",
				"KeyName": { "Ref": "PemKey2" },
				"SecurityGroupIds": [{ "Ref": "CPDBSG" }, { "Ref": "NATCLIENT" }, "sg-42dc8b26"],
				"SubnetId": { "Ref": "Conf1d" },
				"BlockDeviceMappings": [
					{"DeviceName": "/dev/sda1", "Ebs": { "VolumeSize": "50", "VolumeType": "gp2" }},
					{"DeviceName": "xvdb", "Ebs": { "VolumeSize": "1", "VolumeType": "gp2" }},
					{"DeviceName": "xvdc", "Ebs": { "VolumeSize": "1", "VolumeType": "gp2" }},
					{"DeviceName": "xvdd", "Ebs": { "VolumeSize": "1", "VolumeType": "gp2" }},
					{"DeviceName": "xvde", "Ebs": { "VolumeSize": "100", "VolumeType": "gp2" }},
					{"DeviceName": "xvdf", "Ebs": { "VolumeSize": "100", "VolumeType": "gp2" }}
				],
				"Tags": [
				  { "Key" : "Name", "Value": "ms238cpodsql148" },
				  { "Key" : "Application_Id", "Value" : { "Ref": "ApplicationId" } },
				  { "Key" : "Application_Name", "Value" : { "Ref": "ApplicationName" } },
				  { "Key" : "Environment", "Value" :  { "Ref": "Environment" } },
				  { "Key" : "PO_Number", "Value" : { "Ref": "PONumber" } },
				  { "Key" : "Project_ID", "Value" : { "Ref": "ProjectId" } },
				  { "Key" : "Owner", "Value" : { "Ref": "Owner" } },
				  { "Key" : "Approver", "Value" : { "Ref": "Approver" } }
				],
				"UserData": {
					"Fn::Base64": { "Fn::Join": [ "", [
						"<powershell>\n",
						"$size = (Get-PartitionSupportedSize -DiskNumber 4 -PartitionNumber 2)\n",
						"Resize-Partition -DiskNumber 4 -PartitionNumber 2 -Size $size.SizeMax\n",
						"$size = (Get-PartitionSupportedSize -DiskNumber 5 -PartitionNumber 2)\n",
						"Resize-Partition -DiskNumber 5 -PartitionNumber 2 -Size $size.SizeMax\n",
						"Rename-Computer -NewName ms238cpodsql148 -Restart\n",
						"</powershell>"
					]]}
				}
			}
		},
		"ms238cpodsql149": {
			"Type": "AWS::EC2::Instance",
			"Properties": {
				"AvailabilityZone": "us-east-1c",
				"IamInstanceProfile": "Sysco-ApplicationDefaultInstanceProfile-47RRMF15XFMP",
				"ImageId": "ami-1a659560",
				"InstanceType": "t2.large",
				"KeyName": { "Ref": "PemKey2" },
				"SecurityGroupIds": [{ "Ref": "CPDBSG" }, { "Ref": "NATCLIENT" }, "sg-42dc8b26"],
				"SubnetId": { "Ref": "Conf1c" },
				"BlockDeviceMappings": [
					{"DeviceName": "/dev/sda1", "Ebs": { "VolumeSize": "50", "VolumeType": "gp2" }},
					{"DeviceName": "xvdb", "Ebs": { "VolumeSize": "1", "VolumeType": "gp2" }},
					{"DeviceName": "xvdc", "Ebs": { "VolumeSize": "1", "VolumeType": "gp2" }},
					{"DeviceName": "xvdd", "Ebs": { "VolumeSize": "1", "VolumeType": "gp2" }},
					{"DeviceName": "xvde", "Ebs": { "VolumeSize": "100", "VolumeType": "gp2" }},
					{"DeviceName": "xvdf", "Ebs": { "VolumeSize": "100", "VolumeType": "gp2" }}
				],
				"Tags": [
				  { "Key" : "Name", "Value": "ms238cpodsql149" },
				  { "Key" : "Application_Id", "Value" : { "Ref": "ApplicationId" } },
				  { "Key" : "Application_Name", "Value" : { "Ref": "ApplicationName" } },
				  { "Key" : "Environment", "Value" :  { "Ref": "Environment" } },
				  { "Key" : "PO_Number", "Value" : { "Ref": "PONumber" } },
				  { "Key" : "Project_ID", "Value" : { "Ref": "ProjectId" } },
				  { "Key" : "Owner", "Value" : { "Ref": "Owner" } },
				  { "Key" : "Approver", "Value" : { "Ref": "Approver" } }
				],
				"UserData": {
					"Fn::Base64": { "Fn::Join": [ "", [
						"<powershell>\n",
						"$size = (Get-PartitionSupportedSize -DiskNumber 4 -PartitionNumber 2)\n",
						"Resize-Partition -DiskNumber 4 -PartitionNumber 2 -Size $size.SizeMax\n",
						"$size = (Get-PartitionSupportedSize -DiskNumber 5 -PartitionNumber 2)\n",
						"Resize-Partition -DiskNumber 5 -PartitionNumber 2 -Size $size.SizeMax\n",
						"Rename-Computer -NewName ms238cpodsql149 -Restart\n",
						"</powershell>"
					]]}
				}
			}
		},
		"ms238cpodsql150": {
			"Type": "AWS::EC2::Instance",
			"Properties": {
				"AvailabilityZone": "us-east-1d",
				"IamInstanceProfile": "Sysco-ApplicationDefaultInstanceProfile-47RRMF15XFMP",
				"ImageId": "ami-1a659560",
				"InstanceType": "t2.large",
				"KeyName": { "Ref": "PemKey2" },
				"SecurityGroupIds": [{ "Ref": "CPDBSG" }, { "Ref": "NATCLIENT" }, "sg-42dc8b26"],
				"SubnetId": { "Ref": "Conf1d" },
				"BlockDeviceMappings": [
					{"DeviceName": "/dev/sda1", "Ebs": { "VolumeSize": "50", "VolumeType": "gp2" }},
					{"DeviceName": "xvdb", "Ebs": { "VolumeSize": "1", "VolumeType": "gp2" }},
					{"DeviceName": "xvdc", "Ebs": { "VolumeSize": "1", "VolumeType": "gp2" }},
					{"DeviceName": "xvdd", "Ebs": { "VolumeSize": "1", "VolumeType": "gp2" }},
					{"DeviceName": "xvde", "Ebs": { "VolumeSize": "100", "VolumeType": "gp2" }},
					{"DeviceName": "xvdf", "Ebs": { "VolumeSize": "100", "VolumeType": "gp2" }}
				],
				"Tags": [
				  { "Key" : "Name", "Value": "ms238cpodsql150" },
				  { "Key" : "Application_Id", "Value" : { "Ref": "ApplicationId" } },
				  { "Key" : "Application_Name", "Value" : { "Ref": "ApplicationName" } },
				  { "Key" : "Environment", "Value" :  { "Ref": "Environment" } },
				  { "Key" : "PO_Number", "Value" : { "Ref": "PONumber" } },
				  { "Key" : "Project_ID", "Value" : { "Ref": "ProjectId" } },
				  { "Key" : "Owner", "Value" : { "Ref": "Owner" } },
				  { "Key" : "Approver", "Value" : { "Ref": "Approver" } }
				],
				"UserData": {
					"Fn::Base64": { "Fn::Join": [ "", [
						"<powershell>\n",
						"$size = (Get-PartitionSupportedSize -DiskNumber 4 -PartitionNumber 2)\n",
						"Resize-Partition -DiskNumber 4 -PartitionNumber 2 -Size $size.SizeMax\n",
						"$size = (Get-PartitionSupportedSize -DiskNumber 5 -PartitionNumber 2)\n",
						"Resize-Partition -DiskNumber 5 -PartitionNumber 2 -Size $size.SizeMax\n",
						"Rename-Computer -NewName ms238cpodsql150 -Restart\n",
						"</powershell>"
					]]}
				}
			}
		},
		"ms238cpodsql151": {
			"Type": "AWS::EC2::Instance",
			"Properties": {
				"AvailabilityZone": "us-east-1c",
				"IamInstanceProfile": "Sysco-ApplicationDefaultInstanceProfile-47RRMF15XFMP",
				"ImageId": "ami-1a659560",
				"InstanceType": "t2.large",
				"KeyName": { "Ref": "PemKey2" },
				"SecurityGroupIds": [{ "Ref": "CPDBSG" }, { "Ref": "NATCLIENT" }, "sg-42dc8b26"],
				"SubnetId": { "Ref": "Conf1c" },
				"BlockDeviceMappings": [
					{"DeviceName": "/dev/sda1", "Ebs": { "VolumeSize": "50", "VolumeType": "gp2" }},
					{"DeviceName": "xvdb", "Ebs": { "VolumeSize": "1", "VolumeType": "gp2" }},
					{"DeviceName": "xvdc", "Ebs": { "VolumeSize": "1", "VolumeType": "gp2" }},
					{"DeviceName": "xvdd", "Ebs": { "VolumeSize": "1", "VolumeType": "gp2" }},
					{"DeviceName": "xvde", "Ebs": { "VolumeSize": "100", "VolumeType": "gp2" }},
					{"DeviceName": "xvdf", "Ebs": { "VolumeSize": "100", "VolumeType": "gp2" }}
				],
				"Tags": [
				  { "Key" : "Name", "Value": "ms238cpodsql151" },
				  { "Key" : "Application_Id", "Value" : { "Ref": "ApplicationId" } },
				  { "Key" : "Application_Name", "Value" : { "Ref": "ApplicationName" } },
				  { "Key" : "Environment", "Value" :  { "Ref": "Environment" } },
				  { "Key" : "PO_Number", "Value" : { "Ref": "PONumber" } },
				  { "Key" : "Project_ID", "Value" : { "Ref": "ProjectId" } },
				  { "Key" : "Owner", "Value" : { "Ref": "Owner" } },
				  { "Key" : "Approver", "Value" : { "Ref": "Approver" } }
				],
				"UserData": {
					"Fn::Base64": { "Fn::Join": [ "", [
						"<powershell>\n",
						"$size = (Get-PartitionSupportedSize -DiskNumber 4 -PartitionNumber 2)\n",
						"Resize-Partition -DiskNumber 4 -PartitionNumber 2 -Size $size.SizeMax\n",
						"$size = (Get-PartitionSupportedSize -DiskNumber 5 -PartitionNumber 2)\n",
						"Resize-Partition -DiskNumber 5 -PartitionNumber 2 -Size $size.SizeMax\n",
						"Rename-Computer -NewName ms238cpodsql151 -Restart\n",
						"</powershell>"
					]]}
				}
			}
		},
		"ms238cpodsql152": {
			"Type": "AWS::EC2::Instance",
			"Properties": {
				"AvailabilityZone": "us-east-1d",
				"IamInstanceProfile": "Sysco-ApplicationDefaultInstanceProfile-47RRMF15XFMP",
				"ImageId": "ami-1a659560",
				"InstanceType": "t2.large",
				"KeyName": { "Ref": "PemKey2" },
				"SecurityGroupIds": [{ "Ref": "CPDBSG" }, { "Ref": "NATCLIENT" }, "sg-42dc8b26"],
				"SubnetId": { "Ref": "Conf1d" },
				"BlockDeviceMappings": [
					{"DeviceName": "/dev/sda1", "Ebs": { "VolumeSize": "50", "VolumeType": "gp2" }},
					{"DeviceName": "xvdb", "Ebs": { "VolumeSize": "1", "VolumeType": "gp2" }},
					{"DeviceName": "xvdc", "Ebs": { "VolumeSize": "1", "VolumeType": "gp2" }},
					{"DeviceName": "xvdd", "Ebs": { "VolumeSize": "1", "VolumeType": "gp2" }},
					{"DeviceName": "xvde", "Ebs": { "VolumeSize": "100", "VolumeType": "gp2" }},
					{"DeviceName": "xvdf", "Ebs": { "VolumeSize": "100", "VolumeType": "gp2" }}
				],
				"Tags": [
				  { "Key" : "Name", "Value": "ms238cpodsql152" },
				  { "Key" : "Application_Id", "Value" : { "Ref": "ApplicationId" } },
				  { "Key" : "Application_Name", "Value" : { "Ref": "ApplicationName" } },
				  { "Key" : "Environment", "Value" :  { "Ref": "Environment" } },
				  { "Key" : "PO_Number", "Value" : { "Ref": "PONumber" } },
				  { "Key" : "Project_ID", "Value" : { "Ref": "ProjectId" } },
				  { "Key" : "Owner", "Value" : { "Ref": "Owner" } },
				  { "Key" : "Approver", "Value" : { "Ref": "Approver" } }
				],
				"UserData": {
					"Fn::Base64": { "Fn::Join": [ "", [
						"<powershell>\n",
						"$size = (Get-PartitionSupportedSize -DiskNumber 4 -PartitionNumber 2)\n",
						"Resize-Partition -DiskNumber 4 -PartitionNumber 2 -Size $size.SizeMax\n",
						"$size = (Get-PartitionSupportedSize -DiskNumber 5 -PartitionNumber 2)\n",
						"Resize-Partition -DiskNumber 5 -PartitionNumber 2 -Size $size.SizeMax\n",
						"Rename-Computer -NewName ms238cpodsql152 -Restart\n",
						"</powershell>"
					]]}
				}
			}
		},
		"ms238cpodsql153": {
			"Type": "AWS::EC2::Instance",
			"Properties": {
				"AvailabilityZone": "us-east-1c",
				"IamInstanceProfile": "Sysco-ApplicationDefaultInstanceProfile-47RRMF15XFMP",
				"ImageId": "ami-1a659560",
				"InstanceType": "t2.large",
				"KeyName": { "Ref": "PemKey2" },
				"SecurityGroupIds": [{ "Ref": "CPDBSG" }, { "Ref": "NATCLIENT" }, "sg-42dc8b26"],
				"SubnetId": { "Ref": "Conf1c" },
				"BlockDeviceMappings": [
					{"DeviceName": "/dev/sda1", "Ebs": { "VolumeSize": "50", "VolumeType": "gp2" }},
					{"DeviceName": "xvdb", "Ebs": { "VolumeSize": "1", "VolumeType": "gp2" }},
					{"DeviceName": "xvdc", "Ebs": { "VolumeSize": "1", "VolumeType": "gp2" }},
					{"DeviceName": "xvdd", "Ebs": { "VolumeSize": "1", "VolumeType": "gp2" }},
					{"DeviceName": "xvde", "Ebs": { "VolumeSize": "100", "VolumeType": "gp2" }},
					{"DeviceName": "xvdf", "Ebs": { "VolumeSize": "100", "VolumeType": "gp2" }}
				],
				"Tags": [
				  { "Key" : "Name", "Value": "ms238cpodsql153" },
				  { "Key" : "Application_Id", "Value" : { "Ref": "ApplicationId" } },
				  { "Key" : "Application_Name", "Value" : { "Ref": "ApplicationName" } },
				  { "Key" : "Environment", "Value" :  { "Ref": "Environment" } },
				  { "Key" : "PO_Number", "Value" : { "Ref": "PONumber" } },
				  { "Key" : "Project_ID", "Value" : { "Ref": "ProjectId" } },
				  { "Key" : "Owner", "Value" : { "Ref": "Owner" } },
				  { "Key" : "Approver", "Value" : { "Ref": "Approver" } }
				],
				"UserData": {
					"Fn::Base64": { "Fn::Join": [ "", [
						"<powershell>\n",
						"$size = (Get-PartitionSupportedSize -DiskNumber 4 -PartitionNumber 2)\n",
						"Resize-Partition -DiskNumber 4 -PartitionNumber 2 -Size $size.SizeMax\n",
						"$size = (Get-PartitionSupportedSize -DiskNumber 5 -PartitionNumber 2)\n",
						"Resize-Partition -DiskNumber 5 -PartitionNumber 2 -Size $size.SizeMax\n",
						"Rename-Computer -NewName ms238cpodsql153 -Restart\n",
						"</powershell>"
					]]}
				}
			}
		},
		"ms238cpodsql154": {
			"Type": "AWS::EC2::Instance",
			"Properties": {
				"AvailabilityZone": "us-east-1d",
				"IamInstanceProfile": "Sysco-ApplicationDefaultInstanceProfile-47RRMF15XFMP",
				"ImageId": "ami-1a659560",
				"InstanceType": "t2.large",
				"KeyName": { "Ref": "PemKey2" },
				"SecurityGroupIds": [{ "Ref": "CPDBSG" }, { "Ref": "NATCLIENT" }, "sg-42dc8b26"],
				"SubnetId": { "Ref": "Conf1d" },
				"BlockDeviceMappings": [
					{"DeviceName": "/dev/sda1", "Ebs": { "VolumeSize": "50", "VolumeType": "gp2" }},
					{"DeviceName": "xvdb", "Ebs": { "VolumeSize": "1", "VolumeType": "gp2" }},
					{"DeviceName": "xvdc", "Ebs": { "VolumeSize": "1", "VolumeType": "gp2" }},
					{"DeviceName": "xvdd", "Ebs": { "VolumeSize": "1", "VolumeType": "gp2" }},
					{"DeviceName": "xvde", "Ebs": { "VolumeSize": "100", "VolumeType": "gp2" }},
					{"DeviceName": "xvdf", "Ebs": { "VolumeSize": "100", "VolumeType": "gp2" }}
				],
				"Tags": [
				  { "Key" : "Name", "Value": "ms238cpodsql154" },
				  { "Key" : "Application_Id", "Value" : { "Ref": "ApplicationId" } },
				  { "Key" : "Application_Name", "Value" : { "Ref": "ApplicationName" } },
				  { "Key" : "Environment", "Value" :  { "Ref": "Environment" } },
				  { "Key" : "PO_Number", "Value" : { "Ref": "PONumber" } },
				  { "Key" : "Project_ID", "Value" : { "Ref": "ProjectId" } },
				  { "Key" : "Owner", "Value" : { "Ref": "Owner" } },
				  { "Key" : "Approver", "Value" : { "Ref": "Approver" } }
				],
				"UserData": {
					"Fn::Base64": { "Fn::Join": [ "", [
						"<powershell>\n",
						"$size = (Get-PartitionSupportedSize -DiskNumber 4 -PartitionNumber 2)\n",
						"Resize-Partition -DiskNumber 4 -PartitionNumber 2 -Size $size.SizeMax\n",
						"$size = (Get-PartitionSupportedSize -DiskNumber 5 -PartitionNumber 2)\n",
						"Resize-Partition -DiskNumber 5 -PartitionNumber 2 -Size $size.SizeMax\n",
						"Rename-Computer -NewName ms238cpodsql154 -Restart\n",
						"</powershell>"
					]]}
				}
			}
		},
		"ms238cpodsql155": {
			"Type": "AWS::EC2::Instance",
			"Properties": {
				"AvailabilityZone": "us-east-1c",
				"IamInstanceProfile": "Sysco-ApplicationDefaultInstanceProfile-47RRMF15XFMP",
				"ImageId": "ami-1a659560",
				"InstanceType": "t2.large",
				"KeyName": { "Ref": "PemKey2" },
				"SecurityGroupIds": [{ "Ref": "CPDBSG" }, { "Ref": "NATCLIENT" }, "sg-42dc8b26"],
				"SubnetId": { "Ref": "Conf1c" },
				"BlockDeviceMappings": [
					{"DeviceName": "/dev/sda1", "Ebs": { "VolumeSize": "50", "VolumeType": "gp2" }},
					{"DeviceName": "xvdb", "Ebs": { "VolumeSize": "1", "VolumeType": "gp2" }},
					{"DeviceName": "xvdc", "Ebs": { "VolumeSize": "1", "VolumeType": "gp2" }},
					{"DeviceName": "xvdd", "Ebs": { "VolumeSize": "1", "VolumeType": "gp2" }},
					{"DeviceName": "xvde", "Ebs": { "VolumeSize": "100", "VolumeType": "gp2" }},
					{"DeviceName": "xvdf", "Ebs": { "VolumeSize": "100", "VolumeType": "gp2" }}
				],
				"Tags": [
				  { "Key" : "Name", "Value": "ms238cpodsql155" },
				  { "Key" : "Application_Id", "Value" : { "Ref": "ApplicationId" } },
				  { "Key" : "Application_Name", "Value" : { "Ref": "ApplicationName" } },
				  { "Key" : "Environment", "Value" :  { "Ref": "Environment" } },
				  { "Key" : "PO_Number", "Value" : { "Ref": "PONumber" } },
				  { "Key" : "Project_ID", "Value" : { "Ref": "ProjectId" } },
				  { "Key" : "Owner", "Value" : { "Ref": "Owner" } },
				  { "Key" : "Approver", "Value" : { "Ref": "Approver" } }
				],
				"UserData": {
					"Fn::Base64": { "Fn::Join": [ "", [
						"<powershell>\n",
						"$size = (Get-PartitionSupportedSize -DiskNumber 4 -PartitionNumber 2)\n",
						"Resize-Partition -DiskNumber 4 -PartitionNumber 2 -Size $size.SizeMax\n",
						"$size = (Get-PartitionSupportedSize -DiskNumber 5 -PartitionNumber 2)\n",
						"Resize-Partition -DiskNumber 5 -PartitionNumber 2 -Size $size.SizeMax\n",
						"Rename-Computer -NewName ms238cpodsql155 -Restart\n",
						"</powershell>"
					]]}
				}
			}
		},
		"ms238cpodsql156": {
			"Type": "AWS::EC2::Instance",
			"Properties": {
				"AvailabilityZone": "us-east-1d",
				"IamInstanceProfile": "Sysco-ApplicationDefaultInstanceProfile-47RRMF15XFMP",
				"ImageId": "ami-1a659560",
				"InstanceType": "t2.large",
				"KeyName": { "Ref": "PemKey2" },
				"SecurityGroupIds": [{ "Ref": "CPDBSG" }, { "Ref": "NATCLIENT" }, "sg-42dc8b26"],
				"SubnetId": { "Ref": "Conf1d" },
				"BlockDeviceMappings": [
					{"DeviceName": "/dev/sda1", "Ebs": { "VolumeSize": "50", "VolumeType": "gp2" }},
					{"DeviceName": "xvdb", "Ebs": { "VolumeSize": "1", "VolumeType": "gp2" }},
					{"DeviceName": "xvdc", "Ebs": { "VolumeSize": "1", "VolumeType": "gp2" }},
					{"DeviceName": "xvdd", "Ebs": { "VolumeSize": "1", "VolumeType": "gp2" }},
					{"DeviceName": "xvde", "Ebs": { "VolumeSize": "100", "VolumeType": "gp2" }},
					{"DeviceName": "xvdf", "Ebs": { "VolumeSize": "100", "VolumeType": "gp2" }}
				],
				"Tags": [
				  { "Key" : "Name", "Value": "ms238cpodsql156" },
				  { "Key" : "Application_Id", "Value" : { "Ref": "ApplicationId" } },
				  { "Key" : "Application_Name", "Value" : { "Ref": "ApplicationName" } },
				  { "Key" : "Environment", "Value" :  { "Ref": "Environment" } },
				  { "Key" : "PO_Number", "Value" : { "Ref": "PONumber" } },
				  { "Key" : "Project_ID", "Value" : { "Ref": "ProjectId" } },
				  { "Key" : "Owner", "Value" : { "Ref": "Owner" } },
				  { "Key" : "Approver", "Value" : { "Ref": "Approver" } }
				],
				"UserData": {
					"Fn::Base64": { "Fn::Join": [ "", [
						"<powershell>\n",
						"$size = (Get-PartitionSupportedSize -DiskNumber 4 -PartitionNumber 2)\n",
						"Resize-Partition -DiskNumber 4 -PartitionNumber 2 -Size $size.SizeMax\n",
						"$size = (Get-PartitionSupportedSize -DiskNumber 5 -PartitionNumber 2)\n",
						"Resize-Partition -DiskNumber 5 -PartitionNumber 2 -Size $size.SizeMax\n",
						"Rename-Computer -NewName ms238cpodsql156 -Restart\n",
						"</powershell>"
					]]}
				}
			}
		},
		"ms238cpodsql157": {
			"Type": "AWS::EC2::Instance",
			"Properties": {
				"AvailabilityZone": "us-east-1c",
				"IamInstanceProfile": "Sysco-ApplicationDefaultInstanceProfile-47RRMF15XFMP",
				"ImageId": "ami-1a659560",
				"InstanceType": "t2.large",
				"KeyName": { "Ref": "PemKey2" },
				"SecurityGroupIds": [{ "Ref": "CPDBSG" }, { "Ref": "NATCLIENT" }, "sg-42dc8b26"],
				"SubnetId": { "Ref": "Conf1c" },
				"BlockDeviceMappings": [
					{"DeviceName": "/dev/sda1", "Ebs": { "VolumeSize": "50", "VolumeType": "gp2" }},
					{"DeviceName": "xvdb", "Ebs": { "VolumeSize": "1", "VolumeType": "gp2" }},
					{"DeviceName": "xvdc", "Ebs": { "VolumeSize": "1", "VolumeType": "gp2" }},
					{"DeviceName": "xvdd", "Ebs": { "VolumeSize": "1", "VolumeType": "gp2" }},
					{"DeviceName": "xvde", "Ebs": { "VolumeSize": "100", "VolumeType": "gp2" }},
					{"DeviceName": "xvdf", "Ebs": { "VolumeSize": "100", "VolumeType": "gp2" }}
				],
				"Tags": [
				  { "Key" : "Name", "Value": "ms238cpodsql157" },
				  { "Key" : "Application_Id", "Value" : { "Ref": "ApplicationId" } },
				  { "Key" : "Application_Name", "Value" : { "Ref": "ApplicationName" } },
				  { "Key" : "Environment", "Value" :  { "Ref": "Environment" } },
				  { "Key" : "PO_Number", "Value" : { "Ref": "PONumber" } },
				  { "Key" : "Project_ID", "Value" : { "Ref": "ProjectId" } },
				  { "Key" : "Owner", "Value" : { "Ref": "Owner" } },
				  { "Key" : "Approver", "Value" : { "Ref": "Approver" } }
				],
				"UserData": {
					"Fn::Base64": { "Fn::Join": [ "", [
						"<powershell>\n",
						"$size = (Get-PartitionSupportedSize -DiskNumber 4 -PartitionNumber 2)\n",
						"Resize-Partition -DiskNumber 4 -PartitionNumber 2 -Size $size.SizeMax\n",
						"$size = (Get-PartitionSupportedSize -DiskNumber 5 -PartitionNumber 2)\n",
						"Resize-Partition -DiskNumber 5 -PartitionNumber 2 -Size $size.SizeMax\n",
						"Rename-Computer -NewName ms238cpodsql157 -Restart\n",
						"</powershell>"
					]]}
				}
			}
		},
		"ms238cpodsql158": {
			"Type": "AWS::EC2::Instance",
			"Properties": {
				"AvailabilityZone": "us-east-1d",
				"IamInstanceProfile": "Sysco-ApplicationDefaultInstanceProfile-47RRMF15XFMP",
				"ImageId": "ami-1a659560",
				"InstanceType": "t2.large",
				"KeyName": { "Ref": "PemKey2" },
				"SecurityGroupIds": [{ "Ref": "CPDBSG" }, { "Ref": "NATCLIENT" }, "sg-42dc8b26"],
				"SubnetId": { "Ref": "Conf1d" },
				"BlockDeviceMappings": [
					{"DeviceName": "/dev/sda1", "Ebs": { "VolumeSize": "50", "VolumeType": "gp2" }},
					{"DeviceName": "xvdb", "Ebs": { "VolumeSize": "1", "VolumeType": "gp2" }},
					{"DeviceName": "xvdc", "Ebs": { "VolumeSize": "1", "VolumeType": "gp2" }},
					{"DeviceName": "xvdd", "Ebs": { "VolumeSize": "1", "VolumeType": "gp2" }},
					{"DeviceName": "xvde", "Ebs": { "VolumeSize": "100", "VolumeType": "gp2" }},
					{"DeviceName": "xvdf", "Ebs": { "VolumeSize": "100", "VolumeType": "gp2" }}
				],
				"Tags": [
				  { "Key" : "Name", "Value": "ms238cpodsql158" },
				  { "Key" : "Application_Id", "Value" : { "Ref": "ApplicationId" } },
				  { "Key" : "Application_Name", "Value" : { "Ref": "ApplicationName" } },
				  { "Key" : "Environment", "Value" :  { "Ref": "Environment" } },
				  { "Key" : "PO_Number", "Value" : { "Ref": "PONumber" } },
				  { "Key" : "Project_ID", "Value" : { "Ref": "ProjectId" } },
				  { "Key" : "Owner", "Value" : { "Ref": "Owner" } },
				  { "Key" : "Approver", "Value" : { "Ref": "Approver" } }
				],
				"UserData": {
					"Fn::Base64": { "Fn::Join": [ "", [
						"<powershell>\n",
						"$size = (Get-PartitionSupportedSize -DiskNumber 4 -PartitionNumber 2)\n",
						"Resize-Partition -DiskNumber 4 -PartitionNumber 2 -Size $size.SizeMax\n",
						"$size = (Get-PartitionSupportedSize -DiskNumber 5 -PartitionNumber 2)\n",
						"Resize-Partition -DiskNumber 5 -PartitionNumber 2 -Size $size.SizeMax\n",
						"Rename-Computer -NewName ms238cpodsql158 -Restart\n",
						"</powershell>"
					]]}
				}
			}
		},
		"ms238cpodsql159": {
			"Type": "AWS::EC2::Instance",
			"Properties": {
				"AvailabilityZone": "us-east-1c",
				"IamInstanceProfile": "Sysco-ApplicationDefaultInstanceProfile-47RRMF15XFMP",
				"ImageId": "ami-1a659560",
				"InstanceType": "t2.large",
				"KeyName": { "Ref": "PemKey2" },
				"SecurityGroupIds": [{ "Ref": "CPDBSG" }, { "Ref": "NATCLIENT" }, "sg-42dc8b26"],
				"SubnetId": { "Ref": "Conf1c" },
				"BlockDeviceMappings": [
					{"DeviceName": "/dev/sda1", "Ebs": { "VolumeSize": "50", "VolumeType": "gp2" }},
					{"DeviceName": "xvdb", "Ebs": { "VolumeSize": "1", "VolumeType": "gp2" }},
					{"DeviceName": "xvdc", "Ebs": { "VolumeSize": "1", "VolumeType": "gp2" }},
					{"DeviceName": "xvdd", "Ebs": { "VolumeSize": "1", "VolumeType": "gp2" }},
					{"DeviceName": "xvde", "Ebs": { "VolumeSize": "100", "VolumeType": "gp2" }},
					{"DeviceName": "xvdf", "Ebs": { "VolumeSize": "100", "VolumeType": "gp2" }}
				],
				"Tags": [
				  { "Key" : "Name", "Value": "ms238cpodsql159" },
				  { "Key" : "Application_Id", "Value" : { "Ref": "ApplicationId" } },
				  { "Key" : "Application_Name", "Value" : { "Ref": "ApplicationName" } },
				  { "Key" : "Environment", "Value" :  { "Ref": "Environment" } },
				  { "Key" : "PO_Number", "Value" : { "Ref": "PONumber" } },
				  { "Key" : "Project_ID", "Value" : { "Ref": "ProjectId" } },
				  { "Key" : "Owner", "Value" : { "Ref": "Owner" } },
				  { "Key" : "Approver", "Value" : { "Ref": "Approver" } }
				],
				"UserData": {
					"Fn::Base64": { "Fn::Join": [ "", [
						"<powershell>\n",
						"$size = (Get-PartitionSupportedSize -DiskNumber 4 -PartitionNumber 2)\n",
						"Resize-Partition -DiskNumber 4 -PartitionNumber 2 -Size $size.SizeMax\n",
						"$size = (Get-PartitionSupportedSize -DiskNumber 5 -PartitionNumber 2)\n",
						"Resize-Partition -DiskNumber 5 -PartitionNumber 2 -Size $size.SizeMax\n",
						"Rename-Computer -NewName ms238cpodsql159 -Restart\n",
						"</powershell>"
					]]}
				}
			}
		},
		"ms238cpodsql160": {
			"Type": "AWS::EC2::Instance",
			"Properties": {
				"AvailabilityZone": "us-east-1d",
				"IamInstanceProfile": "Sysco-ApplicationDefaultInstanceProfile-47RRMF15XFMP",
				"ImageId": "ami-1a659560",
				"InstanceType": "t2.large",
				"KeyName": { "Ref": "PemKey2" },
				"SecurityGroupIds": [{ "Ref": "CPDBSG" }, { "Ref": "NATCLIENT" }, "sg-42dc8b26"],
				"SubnetId": { "Ref": "Conf1d" },
				"BlockDeviceMappings": [
					{"DeviceName": "/dev/sda1", "Ebs": { "VolumeSize": "50", "VolumeType": "gp2" }},
					{"DeviceName": "xvdb", "Ebs": { "VolumeSize": "1", "VolumeType": "gp2" }},
					{"DeviceName": "xvdc", "Ebs": { "VolumeSize": "1", "VolumeType": "gp2" }},
					{"DeviceName": "xvdd", "Ebs": { "VolumeSize": "1", "VolumeType": "gp2" }},
					{"DeviceName": "xvde", "Ebs": { "VolumeSize": "100", "VolumeType": "gp2" }},
					{"DeviceName": "xvdf", "Ebs": { "VolumeSize": "100", "VolumeType": "gp2" }}
				],
				"Tags": [
				  { "Key" : "Name", "Value": "ms238cpodsql160" },
				  { "Key" : "Application_Id", "Value" : { "Ref": "ApplicationId" } },
				  { "Key" : "Application_Name", "Value" : { "Ref": "ApplicationName" } },
				  { "Key" : "Environment", "Value" :  { "Ref": "Environment" } },
				  { "Key" : "PO_Number", "Value" : { "Ref": "PONumber" } },
				  { "Key" : "Project_ID", "Value" : { "Ref": "ProjectId" } },
				  { "Key" : "Owner", "Value" : { "Ref": "Owner" } },
				  { "Key" : "Approver", "Value" : { "Ref": "Approver" } }
				],
				"UserData": {
					"Fn::Base64": { "Fn::Join": [ "", [
						"<powershell>\n",
						"$size = (Get-PartitionSupportedSize -DiskNumber 4 -PartitionNumber 2)\n",
						"Resize-Partition -DiskNumber 4 -PartitionNumber 2 -Size $size.SizeMax\n",
						"$size = (Get-PartitionSupportedSize -DiskNumber 5 -PartitionNumber 2)\n",
						"Resize-Partition -DiskNumber 5 -PartitionNumber 2 -Size $size.SizeMax\n",
						"Rename-Computer -NewName ms238cpodsql160 -Restart\n",
						"</powershell>"
					]]}
				}
			}
		},
		"ms238cpodsql161": {
			"Type": "AWS::EC2::Instance",
			"Properties": {
				"AvailabilityZone": "us-east-1c",
				"IamInstanceProfile": "Sysco-ApplicationDefaultInstanceProfile-47RRMF15XFMP",
				"ImageId": "ami-1a659560",
				"InstanceType": "t2.large",
				"KeyName": { "Ref": "PemKey2" },
				"SecurityGroupIds": [{ "Ref": "CPDBSG" }, { "Ref": "NATCLIENT" }, "sg-42dc8b26"],
				"SubnetId": { "Ref": "Conf1c" },
				"BlockDeviceMappings": [
					{"DeviceName": "/dev/sda1", "Ebs": { "VolumeSize": "50", "VolumeType": "gp2" }},
					{"DeviceName": "xvdb", "Ebs": { "VolumeSize": "1", "VolumeType": "gp2" }},
					{"DeviceName": "xvdc", "Ebs": { "VolumeSize": "1", "VolumeType": "gp2" }},
					{"DeviceName": "xvdd", "Ebs": { "VolumeSize": "1", "VolumeType": "gp2" }},
					{"DeviceName": "xvde", "Ebs": { "VolumeSize": "100", "VolumeType": "gp2" }},
					{"DeviceName": "xvdf", "Ebs": { "VolumeSize": "100", "VolumeType": "gp2" }}
				],
				"Tags": [
				  { "Key" : "Name", "Value": "ms238cpodsql161" },
				  { "Key" : "Application_Id", "Value" : { "Ref": "ApplicationId" } },
				  { "Key" : "Application_Name", "Value" : { "Ref": "ApplicationName" } },
				  { "Key" : "Environment", "Value" :  { "Ref": "Environment" } },
				  { "Key" : "PO_Number", "Value" : { "Ref": "PONumber" } },
				  { "Key" : "Project_ID", "Value" : { "Ref": "ProjectId" } },
				  { "Key" : "Owner", "Value" : { "Ref": "Owner" } },
				  { "Key" : "Approver", "Value" : { "Ref": "Approver" } }
				],
				"UserData": {
					"Fn::Base64": { "Fn::Join": [ "", [
						"<powershell>\n",
						"$size = (Get-PartitionSupportedSize -DiskNumber 4 -PartitionNumber 2)\n",
						"Resize-Partition -DiskNumber 4 -PartitionNumber 2 -Size $size.SizeMax\n",
						"$size = (Get-PartitionSupportedSize -DiskNumber 5 -PartitionNumber 2)\n",
						"Resize-Partition -DiskNumber 5 -PartitionNumber 2 -Size $size.SizeMax\n",
						"Rename-Computer -NewName ms238cpodsql161 -Restart\n",
						"</powershell>"
					]]}
				}
			}
		},
		"ms238cpodsql162": {
			"Type": "AWS::EC2::Instance",
			"Properties": {
				"AvailabilityZone": "us-east-1d",
				"IamInstanceProfile": "Sysco-ApplicationDefaultInstanceProfile-47RRMF15XFMP",
				"ImageId": "ami-1a659560",
				"InstanceType": "t2.large",
				"KeyName": { "Ref": "PemKey2" },
				"SecurityGroupIds": [{ "Ref": "CPDBSG" }, { "Ref": "NATCLIENT" }, "sg-42dc8b26"],
				"SubnetId": { "Ref": "Conf1d" },
				"BlockDeviceMappings": [
					{"DeviceName": "/dev/sda1", "Ebs": { "VolumeSize": "50", "VolumeType": "gp2" }},
					{"DeviceName": "xvdb", "Ebs": { "VolumeSize": "1", "VolumeType": "gp2" }},
					{"DeviceName": "xvdc", "Ebs": { "VolumeSize": "1", "VolumeType": "gp2" }},
					{"DeviceName": "xvdd", "Ebs": { "VolumeSize": "1", "VolumeType": "gp2" }},
					{"DeviceName": "xvde", "Ebs": { "VolumeSize": "100", "VolumeType": "gp2" }},
					{"DeviceName": "xvdf", "Ebs": { "VolumeSize": "100", "VolumeType": "gp2" }}
				],
				"Tags": [
				  { "Key" : "Name", "Value": "ms238cpodsql162" },
				  { "Key" : "Application_Id", "Value" : { "Ref": "ApplicationId" } },
				  { "Key" : "Application_Name", "Value" : { "Ref": "ApplicationName" } },
				  { "Key" : "Environment", "Value" :  { "Ref": "Environment" } },
				  { "Key" : "PO_Number", "Value" : { "Ref": "PONumber" } },
				  { "Key" : "Project_ID", "Value" : { "Ref": "ProjectId" } },
				  { "Key" : "Owner", "Value" : { "Ref": "Owner" } },
				  { "Key" : "Approver", "Value" : { "Ref": "Approver" } }
				],
				"UserData": {
					"Fn::Base64": { "Fn::Join": [ "", [
						"<powershell>\n",
						"$size = (Get-PartitionSupportedSize -DiskNumber 4 -PartitionNumber 2)\n",
						"Resize-Partition -DiskNumber 4 -PartitionNumber 2 -Size $size.SizeMax\n",
						"$size = (Get-PartitionSupportedSize -DiskNumber 5 -PartitionNumber 2)\n",
						"Resize-Partition -DiskNumber 5 -PartitionNumber 2 -Size $size.SizeMax\n",
						"Rename-Computer -NewName ms238cpodsql162 -Restart\n",
						"</powershell>"
					]]}
				}
			}
		},
		"ms238cpodsql163": {
			"Type": "AWS::EC2::Instance",
			"Properties": {
				"AvailabilityZone": "us-east-1c",
				"IamInstanceProfile": "Sysco-ApplicationDefaultInstanceProfile-47RRMF15XFMP",
				"ImageId": "ami-1a659560",
				"InstanceType": "t2.large",
				"KeyName": { "Ref": "PemKey2" },
				"SecurityGroupIds": [{ "Ref": "CPDBSG" }, { "Ref": "NATCLIENT" }, "sg-42dc8b26"],
				"SubnetId": { "Ref": "Conf1c" },
				"BlockDeviceMappings": [
					{"DeviceName": "/dev/sda1", "Ebs": { "VolumeSize": "50", "VolumeType": "gp2" }},
					{"DeviceName": "xvdb", "Ebs": { "VolumeSize": "1", "VolumeType": "gp2" }},
					{"DeviceName": "xvdc", "Ebs": { "VolumeSize": "1", "VolumeType": "gp2" }},
					{"DeviceName": "xvdd", "Ebs": { "VolumeSize": "1", "VolumeType": "gp2" }},
					{"DeviceName": "xvde", "Ebs": { "VolumeSize": "100", "VolumeType": "gp2" }},
					{"DeviceName": "xvdf", "Ebs": { "VolumeSize": "100", "VolumeType": "gp2" }}
				],
				"Tags": [
				  { "Key" : "Name", "Value": "ms238cpodsql163" },
				  { "Key" : "Application_Id", "Value" : { "Ref": "ApplicationId" } },
				  { "Key" : "Application_Name", "Value" : { "Ref": "ApplicationName" } },
				  { "Key" : "Environment", "Value" :  { "Ref": "Environment" } },
				  { "Key" : "PO_Number", "Value" : { "Ref": "PONumber" } },
				  { "Key" : "Project_ID", "Value" : { "Ref": "ProjectId" } },
				  { "Key" : "Owner", "Value" : { "Ref": "Owner" } },
				  { "Key" : "Approver", "Value" : { "Ref": "Approver" } }
				],
				"UserData": {
					"Fn::Base64": { "Fn::Join": [ "", [
						"<powershell>\n",
						"$size = (Get-PartitionSupportedSize -DiskNumber 4 -PartitionNumber 2)\n",
						"Resize-Partition -DiskNumber 4 -PartitionNumber 2 -Size $size.SizeMax\n",
						"$size = (Get-PartitionSupportedSize -DiskNumber 5 -PartitionNumber 2)\n",
						"Resize-Partition -DiskNumber 5 -PartitionNumber 2 -Size $size.SizeMax\n",
						"Rename-Computer -NewName ms238cpodsql163 -Restart\n",
						"</powershell>"
					]]}
				}
			}
		},
		"ms238cpodsql164": {
			"Type": "AWS::EC2::Instance",
			"Properties": {
				"AvailabilityZone": "us-east-1d",
				"IamInstanceProfile": "Sysco-ApplicationDefaultInstanceProfile-47RRMF15XFMP",
				"ImageId": "ami-1a659560",
				"InstanceType": "t2.large",
				"KeyName": { "Ref": "PemKey2" },
				"SecurityGroupIds": [{ "Ref": "CPDBSG" }, { "Ref": "NATCLIENT" }, "sg-42dc8b26"],
				"SubnetId": { "Ref": "Conf1d" },
				"BlockDeviceMappings": [
					{"DeviceName": "/dev/sda1", "Ebs": { "VolumeSize": "50", "VolumeType": "gp2" }},
					{"DeviceName": "xvdb", "Ebs": { "VolumeSize": "1", "VolumeType": "gp2" }},
					{"DeviceName": "xvdc", "Ebs": { "VolumeSize": "1", "VolumeType": "gp2" }},
					{"DeviceName": "xvdd", "Ebs": { "VolumeSize": "1", "VolumeType": "gp2" }},
					{"DeviceName": "xvde", "Ebs": { "VolumeSize": "100", "VolumeType": "gp2" }},
					{"DeviceName": "xvdf", "Ebs": { "VolumeSize": "100", "VolumeType": "gp2" }}
				],
				"Tags": [
				  { "Key" : "Name", "Value": "ms238cpodsql164" },
				  { "Key" : "Application_Id", "Value" : { "Ref": "ApplicationId" } },
				  { "Key" : "Application_Name", "Value" : { "Ref": "ApplicationName" } },
				  { "Key" : "Environment", "Value" :  { "Ref": "Environment" } },
				  { "Key" : "PO_Number", "Value" : { "Ref": "PONumber" } },
				  { "Key" : "Project_ID", "Value" : { "Ref": "ProjectId" } },
				  { "Key" : "Owner", "Value" : { "Ref": "Owner" } },
				  { "Key" : "Approver", "Value" : { "Ref": "Approver" } }
				],
				"UserData": {
					"Fn::Base64": { "Fn::Join": [ "", [
						"<powershell>\n",
						"$size = (Get-PartitionSupportedSize -DiskNumber 4 -PartitionNumber 2)\n",
						"Resize-Partition -DiskNumber 4 -PartitionNumber 2 -Size $size.SizeMax\n",
						"$size = (Get-PartitionSupportedSize -DiskNumber 5 -PartitionNumber 2)\n",
						"Resize-Partition -DiskNumber 5 -PartitionNumber 2 -Size $size.SizeMax\n",
						"Rename-Computer -NewName ms238cpodsql164 -Restart\n",
						"</powershell>"
					]]}
				}
			}
		},
		"ms238cpodsql165": {
			"Type": "AWS::EC2::Instance",
			"Properties": {
				"AvailabilityZone": "us-east-1c",
				"IamInstanceProfile": "Sysco-ApplicationDefaultInstanceProfile-47RRMF15XFMP",
				"ImageId": "ami-1a659560",
				"InstanceType": "t2.large",
				"KeyName": { "Ref": "PemKey2" },
				"SecurityGroupIds": [{ "Ref": "CPDBSG" }, { "Ref": "NATCLIENT" }, "sg-42dc8b26"],
				"SubnetId": { "Ref": "Conf1c" },
				"BlockDeviceMappings": [
					{"DeviceName": "/dev/sda1", "Ebs": { "VolumeSize": "50", "VolumeType": "gp2" }},
					{"DeviceName": "xvdb", "Ebs": { "VolumeSize": "1", "VolumeType": "gp2" }},
					{"DeviceName": "xvdc", "Ebs": { "VolumeSize": "1", "VolumeType": "gp2" }},
					{"DeviceName": "xvdd", "Ebs": { "VolumeSize": "1", "VolumeType": "gp2" }},
					{"DeviceName": "xvde", "Ebs": { "VolumeSize": "100", "VolumeType": "gp2" }},
					{"DeviceName": "xvdf", "Ebs": { "VolumeSize": "100", "VolumeType": "gp2" }}
				],
				"Tags": [
				  { "Key" : "Name", "Value": "ms238cpodsql165" },
				  { "Key" : "Application_Id", "Value" : { "Ref": "ApplicationId" } },
				  { "Key" : "Application_Name", "Value" : { "Ref": "ApplicationName" } },
				  { "Key" : "Environment", "Value" :  { "Ref": "Environment" } },
				  { "Key" : "PO_Number", "Value" : { "Ref": "PONumber" } },
				  { "Key" : "Project_ID", "Value" : { "Ref": "ProjectId" } },
				  { "Key" : "Owner", "Value" : { "Ref": "Owner" } },
				  { "Key" : "Approver", "Value" : { "Ref": "Approver" } }
				],
				"UserData": {
					"Fn::Base64": { "Fn::Join": [ "", [
						"<powershell>\n",
						"$size = (Get-PartitionSupportedSize -DiskNumber 4 -PartitionNumber 2)\n",
						"Resize-Partition -DiskNumber 4 -PartitionNumber 2 -Size $size.SizeMax\n",
						"$size = (Get-PartitionSupportedSize -DiskNumber 5 -PartitionNumber 2)\n",
						"Resize-Partition -DiskNumber 5 -PartitionNumber 2 -Size $size.SizeMax\n",
						"Rename-Computer -NewName ms238cpodsql165 -Restart\n",
						"</powershell>"
					]]}
				}
			}
		},
		"ms238cpodsql166": {
			"Type": "AWS::EC2::Instance",
			"Properties": {
				"AvailabilityZone": "us-east-1d",
				"IamInstanceProfile": "Sysco-ApplicationDefaultInstanceProfile-47RRMF15XFMP",
				"ImageId": "ami-1a659560",
				"InstanceType": "t2.large",
				"KeyName": { "Ref": "PemKey2" },
				"SecurityGroupIds": [{ "Ref": "CPDBSG" }, { "Ref": "NATCLIENT" }, "sg-42dc8b26"],
				"SubnetId": { "Ref": "Conf1d" },
				"BlockDeviceMappings": [
					{"DeviceName": "/dev/sda1", "Ebs": { "VolumeSize": "50", "VolumeType": "gp2" }},
					{"DeviceName": "xvdb", "Ebs": { "VolumeSize": "1", "VolumeType": "gp2" }},
					{"DeviceName": "xvdc", "Ebs": { "VolumeSize": "1", "VolumeType": "gp2" }},
					{"DeviceName": "xvdd", "Ebs": { "VolumeSize": "1", "VolumeType": "gp2" }},
					{"DeviceName": "xvde", "Ebs": { "VolumeSize": "100", "VolumeType": "gp2" }},
					{"DeviceName": "xvdf", "Ebs": { "VolumeSize": "100", "VolumeType": "gp2" }}
				],
				"Tags": [
				  { "Key" : "Name", "Value": "ms238cpodsql166" },
				  { "Key" : "Application_Id", "Value" : { "Ref": "ApplicationId" } },
				  { "Key" : "Application_Name", "Value" : { "Ref": "ApplicationName" } },
				  { "Key" : "Environment", "Value" :  { "Ref": "Environment" } },
				  { "Key" : "PO_Number", "Value" : { "Ref": "PONumber" } },
				  { "Key" : "Project_ID", "Value" : { "Ref": "ProjectId" } },
				  { "Key" : "Owner", "Value" : { "Ref": "Owner" } },
				  { "Key" : "Approver", "Value" : { "Ref": "Approver" } }
				],
				"UserData": {
					"Fn::Base64": { "Fn::Join": [ "", [
						"<powershell>\n",
						"$size = (Get-PartitionSupportedSize -DiskNumber 4 -PartitionNumber 2)\n",
						"Resize-Partition -DiskNumber 4 -PartitionNumber 2 -Size $size.SizeMax\n",
						"$size = (Get-PartitionSupportedSize -DiskNumber 5 -PartitionNumber 2)\n",
						"Resize-Partition -DiskNumber 5 -PartitionNumber 2 -Size $size.SizeMax\n",
						"Rename-Computer -NewName ms238cpodsql166 -Restart\n",
						"</powershell>"
					]]}
				}
			}
		},
		"ms238cpodsql167": {
			"Type": "AWS::EC2::Instance",
			"Properties": {
				"AvailabilityZone": "us-east-1c",
				"IamInstanceProfile": "Sysco-ApplicationDefaultInstanceProfile-47RRMF15XFMP",
				"ImageId": "ami-1a659560",
				"InstanceType": "t2.large",
				"KeyName": { "Ref": "PemKey2" },
				"SecurityGroupIds": [{ "Ref": "CPDBSG" }, { "Ref": "NATCLIENT" }, "sg-42dc8b26"],
				"SubnetId": { "Ref": "Conf1c" },
				"BlockDeviceMappings": [
					{"DeviceName": "/dev/sda1", "Ebs": { "VolumeSize": "50", "VolumeType": "gp2" }},
					{"DeviceName": "xvdb", "Ebs": { "VolumeSize": "1", "VolumeType": "gp2" }},
					{"DeviceName": "xvdc", "Ebs": { "VolumeSize": "1", "VolumeType": "gp2" }},
					{"DeviceName": "xvdd", "Ebs": { "VolumeSize": "1", "VolumeType": "gp2" }},
					{"DeviceName": "xvde", "Ebs": { "VolumeSize": "100", "VolumeType": "gp2" }},
					{"DeviceName": "xvdf", "Ebs": { "VolumeSize": "100", "VolumeType": "gp2" }}
				],
				"Tags": [
				  { "Key" : "Name", "Value": "ms238cpodsql167" },
				  { "Key" : "Application_Id", "Value" : { "Ref": "ApplicationId" } },
				  { "Key" : "Application_Name", "Value" : { "Ref": "ApplicationName" } },
				  { "Key" : "Environment", "Value" :  { "Ref": "Environment" } },
				  { "Key" : "PO_Number", "Value" : { "Ref": "PONumber" } },
				  { "Key" : "Project_ID", "Value" : { "Ref": "ProjectId" } },
				  { "Key" : "Owner", "Value" : { "Ref": "Owner" } },
				  { "Key" : "Approver", "Value" : { "Ref": "Approver" } }
				],
				"UserData": {
					"Fn::Base64": { "Fn::Join": [ "", [
						"<powershell>\n",
						"$size = (Get-PartitionSupportedSize -DiskNumber 4 -PartitionNumber 2)\n",
						"Resize-Partition -DiskNumber 4 -PartitionNumber 2 -Size $size.SizeMax\n",
						"$size = (Get-PartitionSupportedSize -DiskNumber 5 -PartitionNumber 2)\n",
						"Resize-Partition -DiskNumber 5 -PartitionNumber 2 -Size $size.SizeMax\n",
						"Rename-Computer -NewName ms238cpodsql167 -Restart\n",
						"</powershell>"
					]]}
				}
			}
		},
		"ms238cpodsql168": {
			"Type": "AWS::EC2::Instance",
			"Properties": {
				"AvailabilityZone": "us-east-1d",
				"IamInstanceProfile": "Sysco-ApplicationDefaultInstanceProfile-47RRMF15XFMP",
				"ImageId": "ami-1a659560",
				"InstanceType": "t2.large",
				"KeyName": { "Ref": "PemKey2" },
				"SecurityGroupIds": [{ "Ref": "CPDBSG" }, { "Ref": "NATCLIENT" }, "sg-42dc8b26"],
				"SubnetId": { "Ref": "Conf1d" },
				"BlockDeviceMappings": [
					{"DeviceName": "/dev/sda1", "Ebs": { "VolumeSize": "50", "VolumeType": "gp2" }},
					{"DeviceName": "xvdb", "Ebs": { "VolumeSize": "1", "VolumeType": "gp2" }},
					{"DeviceName": "xvdc", "Ebs": { "VolumeSize": "1", "VolumeType": "gp2" }},
					{"DeviceName": "xvdd", "Ebs": { "VolumeSize": "1", "VolumeType": "gp2" }},
					{"DeviceName": "xvde", "Ebs": { "VolumeSize": "100", "VolumeType": "gp2" }},
					{"DeviceName": "xvdf", "Ebs": { "VolumeSize": "100", "VolumeType": "gp2" }}
				],
				"Tags": [
				  { "Key" : "Name", "Value": "ms238cpodsql168" },
				  { "Key" : "Application_Id", "Value" : { "Ref": "ApplicationId" } },
				  { "Key" : "Application_Name", "Value" : { "Ref": "ApplicationName" } },
				  { "Key" : "Environment", "Value" :  { "Ref": "Environment" } },
				  { "Key" : "PO_Number", "Value" : { "Ref": "PONumber" } },
				  { "Key" : "Project_ID", "Value" : { "Ref": "ProjectId" } },
				  { "Key" : "Owner", "Value" : { "Ref": "Owner" } },
				  { "Key" : "Approver", "Value" : { "Ref": "Approver" } }
				],
				"UserData": {
					"Fn::Base64": { "Fn::Join": [ "", [
						"<powershell>\n",
						"$size = (Get-PartitionSupportedSize -DiskNumber 4 -PartitionNumber 2)\n",
						"Resize-Partition -DiskNumber 4 -PartitionNumber 2 -Size $size.SizeMax\n",
						"$size = (Get-PartitionSupportedSize -DiskNumber 5 -PartitionNumber 2)\n",
						"Resize-Partition -DiskNumber 5 -PartitionNumber 2 -Size $size.SizeMax\n",
						"Rename-Computer -NewName ms238cpodsql168 -Restart\n",
						"</powershell>"
					]]}
				}
			}
		},
		"ms238cpodsql169": {
			"Type": "AWS::EC2::Instance",
			"Properties": {
				"AvailabilityZone": "us-east-1c",
				"IamInstanceProfile": "Sysco-ApplicationDefaultInstanceProfile-47RRMF15XFMP",
				"ImageId": "ami-1a659560",
				"InstanceType": "t2.large",
				"KeyName": { "Ref": "PemKey2" },
				"SecurityGroupIds": [{ "Ref": "CPDBSG" }, { "Ref": "NATCLIENT" }, "sg-42dc8b26"],
				"SubnetId": { "Ref": "Conf1c" },
				"BlockDeviceMappings": [
					{"DeviceName": "/dev/sda1", "Ebs": { "VolumeSize": "50", "VolumeType": "gp2" }},
					{"DeviceName": "xvdb", "Ebs": { "VolumeSize": "1", "VolumeType": "gp2" }},
					{"DeviceName": "xvdc", "Ebs": { "VolumeSize": "1", "VolumeType": "gp2" }},
					{"DeviceName": "xvdd", "Ebs": { "VolumeSize": "1", "VolumeType": "gp2" }},
					{"DeviceName": "xvde", "Ebs": { "VolumeSize": "100", "VolumeType": "gp2" }},
					{"DeviceName": "xvdf", "Ebs": { "VolumeSize": "100", "VolumeType": "gp2" }}
				],
				"Tags": [
				  { "Key" : "Name", "Value": "ms238cpodsql169" },
				  { "Key" : "Application_Id", "Value" : { "Ref": "ApplicationId" } },
				  { "Key" : "Application_Name", "Value" : { "Ref": "ApplicationName" } },
				  { "Key" : "Environment", "Value" :  { "Ref": "Environment" } },
				  { "Key" : "PO_Number", "Value" : { "Ref": "PONumber" } },
				  { "Key" : "Project_ID", "Value" : { "Ref": "ProjectId" } },
				  { "Key" : "Owner", "Value" : { "Ref": "Owner" } },
				  { "Key" : "Approver", "Value" : { "Ref": "Approver" } }
				],
				"UserData": {
					"Fn::Base64": { "Fn::Join": [ "", [
						"<powershell>\n",
						"$size = (Get-PartitionSupportedSize -DiskNumber 4 -PartitionNumber 2)\n",
						"Resize-Partition -DiskNumber 4 -PartitionNumber 2 -Size $size.SizeMax\n",
						"$size = (Get-PartitionSupportedSize -DiskNumber 5 -PartitionNumber 2)\n",
						"Resize-Partition -DiskNumber 5 -PartitionNumber 2 -Size $size.SizeMax\n",
						"Rename-Computer -NewName ms238cpodsql169 -Restart\n",
						"</powershell>"
					]]}
				}
			}
		},
		"ms238cpodsql170": {
			"Type": "AWS::EC2::Instance",
			"Properties": {
				"AvailabilityZone": "us-east-1d",
				"IamInstanceProfile": "Sysco-ApplicationDefaultInstanceProfile-47RRMF15XFMP",
				"ImageId": "ami-1a659560",
				"InstanceType": "t2.large",
				"KeyName": { "Ref": "PemKey2" },
				"SecurityGroupIds": [{ "Ref": "CPDBSG" }, { "Ref": "NATCLIENT" }, "sg-42dc8b26"],
				"SubnetId": { "Ref": "Conf1d" },
				"BlockDeviceMappings": [
					{"DeviceName": "/dev/sda1", "Ebs": { "VolumeSize": "50", "VolumeType": "gp2" }},
					{"DeviceName": "xvdb", "Ebs": { "VolumeSize": "1", "VolumeType": "gp2" }},
					{"DeviceName": "xvdc", "Ebs": { "VolumeSize": "1", "VolumeType": "gp2" }},
					{"DeviceName": "xvdd", "Ebs": { "VolumeSize": "1", "VolumeType": "gp2" }},
					{"DeviceName": "xvde", "Ebs": { "VolumeSize": "100", "VolumeType": "gp2" }},
					{"DeviceName": "xvdf", "Ebs": { "VolumeSize": "100", "VolumeType": "gp2" }}
				],
				"Tags": [
				  { "Key" : "Name", "Value": "ms238cpodsql170" },
				  { "Key" : "Application_Id", "Value" : { "Ref": "ApplicationId" } },
				  { "Key" : "Application_Name", "Value" : { "Ref": "ApplicationName" } },
				  { "Key" : "Environment", "Value" :  { "Ref": "Environment" } },
				  { "Key" : "PO_Number", "Value" : { "Ref": "PONumber" } },
				  { "Key" : "Project_ID", "Value" : { "Ref": "ProjectId" } },
				  { "Key" : "Owner", "Value" : { "Ref": "Owner" } },
				  { "Key" : "Approver", "Value" : { "Ref": "Approver" } }
				],
				"UserData": {
					"Fn::Base64": { "Fn::Join": [ "", [
						"<powershell>\n",
						"$size = (Get-PartitionSupportedSize -DiskNumber 4 -PartitionNumber 2)\n",
						"Resize-Partition -DiskNumber 4 -PartitionNumber 2 -Size $size.SizeMax\n",
						"$size = (Get-PartitionSupportedSize -DiskNumber 5 -PartitionNumber 2)\n",
						"Resize-Partition -DiskNumber 5 -PartitionNumber 2 -Size $size.SizeMax\n",
						"Rename-Computer -NewName ms238cpodsql170 -Restart\n",
						"</powershell>"
					]]}
				}
			}
		},
		"ms238cpodsql171": {
			"Type": "AWS::EC2::Instance",
			"Properties": {
				"AvailabilityZone": "us-east-1c",
				"IamInstanceProfile": "Sysco-ApplicationDefaultInstanceProfile-47RRMF15XFMP",
				"ImageId": "ami-1a659560",
				"InstanceType": "t2.large",
				"KeyName": { "Ref": "PemKey2" },
				"SecurityGroupIds": [{ "Ref": "CPDBSG" }, { "Ref": "NATCLIENT" }, "sg-42dc8b26"],
				"SubnetId": { "Ref": "Conf1c" },
				"BlockDeviceMappings": [
					{"DeviceName": "/dev/sda1", "Ebs": { "VolumeSize": "50", "VolumeType": "gp2" }},
					{"DeviceName": "xvdb", "Ebs": { "VolumeSize": "1", "VolumeType": "gp2" }},
					{"DeviceName": "xvdc", "Ebs": { "VolumeSize": "1", "VolumeType": "gp2" }},
					{"DeviceName": "xvdd", "Ebs": { "VolumeSize": "1", "VolumeType": "gp2" }},
					{"DeviceName": "xvde", "Ebs": { "VolumeSize": "100", "VolumeType": "gp2" }},
					{"DeviceName": "xvdf", "Ebs": { "VolumeSize": "100", "VolumeType": "gp2" }}
				],
				"Tags": [
				  { "Key" : "Name", "Value": "ms238cpodsql171" },
				  { "Key" : "Application_Id", "Value" : { "Ref": "ApplicationId" } },
				  { "Key" : "Application_Name", "Value" : { "Ref": "ApplicationName" } },
				  { "Key" : "Environment", "Value" :  { "Ref": "Environment" } },
				  { "Key" : "PO_Number", "Value" : { "Ref": "PONumber" } },
				  { "Key" : "Project_ID", "Value" : { "Ref": "ProjectId" } },
				  { "Key" : "Owner", "Value" : { "Ref": "Owner" } },
				  { "Key" : "Approver", "Value" : { "Ref": "Approver" } }
				],
				"UserData": {
					"Fn::Base64": { "Fn::Join": [ "", [
						"<powershell>\n",
						"$size = (Get-PartitionSupportedSize -DiskNumber 4 -PartitionNumber 2)\n",
						"Resize-Partition -DiskNumber 4 -PartitionNumber 2 -Size $size.SizeMax\n",
						"$size = (Get-PartitionSupportedSize -DiskNumber 5 -PartitionNumber 2)\n",
						"Resize-Partition -DiskNumber 5 -PartitionNumber 2 -Size $size.SizeMax\n",
						"Rename-Computer -NewName ms238cpodsql171 -Restart\n",
						"</powershell>"
					]]}
				}
			}
		},
		"ms238cpodsql172": {
			"Type": "AWS::EC2::Instance",
			"Properties": {
				"AvailabilityZone": "us-east-1d",
				"IamInstanceProfile": "Sysco-ApplicationDefaultInstanceProfile-47RRMF15XFMP",
				"ImageId": "ami-1a659560",
				"InstanceType": "t2.large",
				"KeyName": { "Ref": "PemKey2" },
				"SecurityGroupIds": [{ "Ref": "CPDBSG" }, { "Ref": "NATCLIENT" }, "sg-42dc8b26"],
				"SubnetId": { "Ref": "Conf1d" },
				"BlockDeviceMappings": [
					{"DeviceName": "/dev/sda1", "Ebs": { "VolumeSize": "50", "VolumeType": "gp2" }},
					{"DeviceName": "xvdb", "Ebs": { "VolumeSize": "1", "VolumeType": "gp2" }},
					{"DeviceName": "xvdc", "Ebs": { "VolumeSize": "1", "VolumeType": "gp2" }},
					{"DeviceName": "xvdd", "Ebs": { "VolumeSize": "1", "VolumeType": "gp2" }},
					{"DeviceName": "xvde", "Ebs": { "VolumeSize": "100", "VolumeType": "gp2" }},
					{"DeviceName": "xvdf", "Ebs": { "VolumeSize": "100", "VolumeType": "gp2" }}
				],
				"Tags": [
				  { "Key" : "Name", "Value": "ms238cpodsql172" },
				  { "Key" : "Application_Id", "Value" : { "Ref": "ApplicationId" } },
				  { "Key" : "Application_Name", "Value" : { "Ref": "ApplicationName" } },
				  { "Key" : "Environment", "Value" :  { "Ref": "Environment" } },
				  { "Key" : "PO_Number", "Value" : { "Ref": "PONumber" } },
				  { "Key" : "Project_ID", "Value" : { "Ref": "ProjectId" } },
				  { "Key" : "Owner", "Value" : { "Ref": "Owner" } },
				  { "Key" : "Approver", "Value" : { "Ref": "Approver" } }
				],
				"UserData": {
					"Fn::Base64": { "Fn::Join": [ "", [
						"<powershell>\n",
						"$size = (Get-PartitionSupportedSize -DiskNumber 4 -PartitionNumber 2)\n",
						"Resize-Partition -DiskNumber 4 -PartitionNumber 2 -Size $size.SizeMax\n",
						"$size = (Get-PartitionSupportedSize -DiskNumber 5 -PartitionNumber 2)\n",
						"Resize-Partition -DiskNumber 5 -PartitionNumber 2 -Size $size.SizeMax\n",
						"Rename-Computer -NewName ms238cpodsql172 -Restart\n",
						"</powershell>"
					]]}
				}
			}
		},
		"ms238cpodsql173": {
			"Type": "AWS::EC2::Instance",
			"Properties": {
				"AvailabilityZone": "us-east-1c",
				"IamInstanceProfile": "Sysco-ApplicationDefaultInstanceProfile-47RRMF15XFMP",
				"ImageId": "ami-1a659560",
				"InstanceType": "t2.large",
				"KeyName": { "Ref": "PemKey2" },
				"SecurityGroupIds": [{ "Ref": "CPDBSG" }, { "Ref": "NATCLIENT" }, "sg-42dc8b26"],
				"SubnetId": { "Ref": "Conf1c" },
				"BlockDeviceMappings": [
					{"DeviceName": "/dev/sda1", "Ebs": { "VolumeSize": "50", "VolumeType": "gp2" }},
					{"DeviceName": "xvdb", "Ebs": { "VolumeSize": "1", "VolumeType": "gp2" }},
					{"DeviceName": "xvdc", "Ebs": { "VolumeSize": "1", "VolumeType": "gp2" }},
					{"DeviceName": "xvdd", "Ebs": { "VolumeSize": "1", "VolumeType": "gp2" }},
					{"DeviceName": "xvde", "Ebs": { "VolumeSize": "100", "VolumeType": "gp2" }},
					{"DeviceName": "xvdf", "Ebs": { "VolumeSize": "100", "VolumeType": "gp2" }}
				],
				"Tags": [
				  { "Key" : "Name", "Value": "ms238cpodsql173" },
				  { "Key" : "Application_Id", "Value" : { "Ref": "ApplicationId" } },
				  { "Key" : "Application_Name", "Value" : { "Ref": "ApplicationName" } },
				  { "Key" : "Environment", "Value" :  { "Ref": "Environment" } },
				  { "Key" : "PO_Number", "Value" : { "Ref": "PONumber" } },
				  { "Key" : "Project_ID", "Value" : { "Ref": "ProjectId" } },
				  { "Key" : "Owner", "Value" : { "Ref": "Owner" } },
				  { "Key" : "Approver", "Value" : { "Ref": "Approver" } }
				],
				"UserData": {
					"Fn::Base64": { "Fn::Join": [ "", [
						"<powershell>\n",
						"$size = (Get-PartitionSupportedSize -DiskNumber 4 -PartitionNumber 2)\n",
						"Resize-Partition -DiskNumber 4 -PartitionNumber 2 -Size $size.SizeMax\n",
						"$size = (Get-PartitionSupportedSize -DiskNumber 5 -PartitionNumber 2)\n",
						"Resize-Partition -DiskNumber 5 -PartitionNumber 2 -Size $size.SizeMax\n",
						"Rename-Computer -NewName ms238cpodsql173 -Restart\n",
						"</powershell>"
					]]}
				}
			}
		},
		"ms238cpodsql174": {
			"Type": "AWS::EC2::Instance",
			"Properties": {
				"AvailabilityZone": "us-east-1d",
				"IamInstanceProfile": "Sysco-ApplicationDefaultInstanceProfile-47RRMF15XFMP",
				"ImageId": "ami-1a659560",
				"InstanceType": "t2.large",
				"KeyName": { "Ref": "PemKey2" },
				"SecurityGroupIds": [{ "Ref": "CPDBSG" }, { "Ref": "NATCLIENT" }, "sg-42dc8b26"],
				"SubnetId": { "Ref": "Conf1d" },
				"BlockDeviceMappings": [
					{"DeviceName": "/dev/sda1", "Ebs": { "VolumeSize": "50", "VolumeType": "gp2" }},
					{"DeviceName": "xvdb", "Ebs": { "VolumeSize": "1", "VolumeType": "gp2" }},
					{"DeviceName": "xvdc", "Ebs": { "VolumeSize": "1", "VolumeType": "gp2" }},
					{"DeviceName": "xvdd", "Ebs": { "VolumeSize": "1", "VolumeType": "gp2" }},
					{"DeviceName": "xvde", "Ebs": { "VolumeSize": "100", "VolumeType": "gp2" }},
					{"DeviceName": "xvdf", "Ebs": { "VolumeSize": "100", "VolumeType": "gp2" }}
				],
				"Tags": [
				  { "Key" : "Name", "Value": "ms238cpodsql174" },
				  { "Key" : "Application_Id", "Value" : { "Ref": "ApplicationId" } },
				  { "Key" : "Application_Name", "Value" : { "Ref": "ApplicationName" } },
				  { "Key" : "Environment", "Value" :  { "Ref": "Environment" } },
				  { "Key" : "PO_Number", "Value" : { "Ref": "PONumber" } },
				  { "Key" : "Project_ID", "Value" : { "Ref": "ProjectId" } },
				  { "Key" : "Owner", "Value" : { "Ref": "Owner" } },
				  { "Key" : "Approver", "Value" : { "Ref": "Approver" } }
				],
				"UserData": {
					"Fn::Base64": { "Fn::Join": [ "", [
						"<powershell>\n",
						"$size = (Get-PartitionSupportedSize -DiskNumber 4 -PartitionNumber 2)\n",
						"Resize-Partition -DiskNumber 4 -PartitionNumber 2 -Size $size.SizeMax\n",
						"$size = (Get-PartitionSupportedSize -DiskNumber 5 -PartitionNumber 2)\n",
						"Resize-Partition -DiskNumber 5 -PartitionNumber 2 -Size $size.SizeMax\n",
						"Rename-Computer -NewName ms238cpodsql174 -Restart\n",
						"</powershell>"
					]]}
				}
			}
		},
		"ms238cpodsql201": {
			"Type": "AWS::EC2::Instance",
			"Properties": {
				"AvailabilityZone": "us-east-1d",
				"IamInstanceProfile": "Sysco-ApplicationDefaultInstanceProfile-47RRMF15XFMP",
				"ImageId": "ami-1a659560",
				"InstanceType": "t2.large",
				"KeyName": { "Ref": "PemKey2" },
				"SecurityGroupIds": [{ "Ref": "CPDBSG" }, { "Ref": "NATCLIENT" }, "sg-42dc8b26"],
				"SubnetId": { "Ref": "Conf1d" },
				"BlockDeviceMappings": [
					{"DeviceName": "/dev/sda1", "Ebs": { "VolumeSize": "50", "VolumeType": "gp2" }},
					{"DeviceName": "xvdb", "Ebs": { "VolumeSize": "1", "VolumeType": "gp2" }},
					{"DeviceName": "xvdc", "Ebs": { "VolumeSize": "1", "VolumeType": "gp2" }},
					{"DeviceName": "xvdd", "Ebs": { "VolumeSize": "1", "VolumeType": "gp2" }},
					{"DeviceName": "xvde", "Ebs": { "VolumeSize": "100", "VolumeType": "gp2" }},
					{"DeviceName": "xvdf", "Ebs": { "VolumeSize": "100", "VolumeType": "gp2" }}
				],
				"Tags": [
				  { "Key" : "Name", "Value": "ms238cpodsql201" },
				  { "Key" : "Application_Id", "Value" : { "Ref": "ApplicationId" } },
				  { "Key" : "Application_Name", "Value" : { "Ref": "ApplicationName" } },
				  { "Key" : "Environment", "Value" :  { "Ref": "Environment" } },
				  { "Key" : "PO_Number", "Value" : { "Ref": "PONumber" } },
				  { "Key" : "Project_ID", "Value" : { "Ref": "ProjectId" } },
				  { "Key" : "Owner", "Value" : { "Ref": "Owner" } },
				  { "Key" : "Approver", "Value" : { "Ref": "Approver" } }
				],
				"UserData": {
					"Fn::Base64": { "Fn::Join": [ "", [
						"<powershell>\n",
						"$size = (Get-PartitionSupportedSize -DiskNumber 4 -PartitionNumber 2)\n",
						"Resize-Partition -DiskNumber 4 -PartitionNumber 2 -Size $size.SizeMax\n",
						"$size = (Get-PartitionSupportedSize -DiskNumber 5 -PartitionNumber 2)\n",
						"Resize-Partition -DiskNumber 5 -PartitionNumber 2 -Size $size.SizeMax\n",
						"Rename-Computer -NewName ms238cpodsql201 -Restart\n",
						"</powershell>"
					]]}
				}
			}
		},
		"ms238cpodsql202": {
			"Type": "AWS::EC2::Instance",
			"Properties": {
				"AvailabilityZone": "us-east-1c",
				"IamInstanceProfile": "Sysco-ApplicationDefaultInstanceProfile-47RRMF15XFMP",
				"ImageId": "ami-1a659560",
				"InstanceType": "t2.large",
				"KeyName": { "Ref": "PemKey2" },
				"SecurityGroupIds": [{ "Ref": "CPDBSG" }, { "Ref": "NATCLIENT" }, "sg-42dc8b26"],
				"SubnetId": { "Ref": "Conf1c" },
				"BlockDeviceMappings": [
					{"DeviceName": "/dev/sda1", "Ebs": { "VolumeSize": "50", "VolumeType": "gp2" }},
					{"DeviceName": "xvdb", "Ebs": { "VolumeSize": "1", "VolumeType": "gp2" }},
					{"DeviceName": "xvdc", "Ebs": { "VolumeSize": "1", "VolumeType": "gp2" }},
					{"DeviceName": "xvdd", "Ebs": { "VolumeSize": "1", "VolumeType": "gp2" }},
					{"DeviceName": "xvde", "Ebs": { "VolumeSize": "100", "VolumeType": "gp2" }},
					{"DeviceName": "xvdf", "Ebs": { "VolumeSize": "100", "VolumeType": "gp2" }}
				],
				"Tags": [
				  { "Key" : "Name", "Value": "ms238cpodsql202" },
				  { "Key" : "Application_Id", "Value" : { "Ref": "ApplicationId" } },
				  { "Key" : "Application_Name", "Value" : { "Ref": "ApplicationName" } },
				  { "Key" : "Environment", "Value" :  { "Ref": "Environment" } },
				  { "Key" : "PO_Number", "Value" : { "Ref": "PONumber" } },
				  { "Key" : "Project_ID", "Value" : { "Ref": "ProjectId" } },
				  { "Key" : "Owner", "Value" : { "Ref": "Owner" } },
				  { "Key" : "Approver", "Value" : { "Ref": "Approver" } }
				],
				"UserData": {
					"Fn::Base64": { "Fn::Join": [ "", [
						"<powershell>\n",
						"$size = (Get-PartitionSupportedSize -DiskNumber 4 -PartitionNumber 2)\n",
						"Resize-Partition -DiskNumber 4 -PartitionNumber 2 -Size $size.SizeMax\n",
						"$size = (Get-PartitionSupportedSize -DiskNumber 5 -PartitionNumber 2)\n",
						"Resize-Partition -DiskNumber 5 -PartitionNumber 2 -Size $size.SizeMax\n",
						"Rename-Computer -NewName ms238cpodsql202 -Restart\n",
						"</powershell>"
					]]}
				}
			}
		},
		"ms238cpodsql203": {
			"Type": "AWS::EC2::Instance",
			"Properties": {
				"AvailabilityZone": "us-east-1d",
				"IamInstanceProfile": "Sysco-ApplicationDefaultInstanceProfile-47RRMF15XFMP",
				"ImageId": "ami-1a659560",
				"InstanceType": "t2.large",
				"KeyName": { "Ref": "PemKey2" },
				"SecurityGroupIds": [{ "Ref": "CPDBSG" }, { "Ref": "NATCLIENT" }, "sg-42dc8b26"],
				"SubnetId": { "Ref": "Conf1d" },
				"BlockDeviceMappings": [
					{"DeviceName": "/dev/sda1", "Ebs": { "VolumeSize": "50", "VolumeType": "gp2" }},
					{"DeviceName": "xvdb", "Ebs": { "VolumeSize": "1", "VolumeType": "gp2" }},
					{"DeviceName": "xvdc", "Ebs": { "VolumeSize": "1", "VolumeType": "gp2" }},
					{"DeviceName": "xvdd", "Ebs": { "VolumeSize": "1", "VolumeType": "gp2" }},
					{"DeviceName": "xvde", "Ebs": { "VolumeSize": "100", "VolumeType": "gp2" }},
					{"DeviceName": "xvdf", "Ebs": { "VolumeSize": "100", "VolumeType": "gp2" }}
				],
				"Tags": [
				  { "Key" : "Name", "Value": "ms238cpodsql203" },
				  { "Key" : "Application_Id", "Value" : { "Ref": "ApplicationId" } },
				  { "Key" : "Application_Name", "Value" : { "Ref": "ApplicationName" } },
				  { "Key" : "Environment", "Value" :  { "Ref": "Environment" } },
				  { "Key" : "PO_Number", "Value" : { "Ref": "PONumber" } },
				  { "Key" : "Project_ID", "Value" : { "Ref": "ProjectId" } },
				  { "Key" : "Owner", "Value" : { "Ref": "Owner" } },
				  { "Key" : "Approver", "Value" : { "Ref": "Approver" } }
				],
				"UserData": {
					"Fn::Base64": { "Fn::Join": [ "", [
						"<powershell>\n",
						"$size = (Get-PartitionSupportedSize -DiskNumber 4 -PartitionNumber 2)\n",
						"Resize-Partition -DiskNumber 4 -PartitionNumber 2 -Size $size.SizeMax\n",
						"$size = (Get-PartitionSupportedSize -DiskNumber 5 -PartitionNumber 2)\n",
						"Resize-Partition -DiskNumber 5 -PartitionNumber 2 -Size $size.SizeMax\n",
						"Rename-Computer -NewName ms238cpodsql203 -Restart\n",
						"</powershell>"
					]]}
				}
			}
		},
		"ms238cpodsql204": {
			"Type": "AWS::EC2::Instance",
			"Properties": {
				"AvailabilityZone": "us-east-1c",
				"IamInstanceProfile": "Sysco-ApplicationDefaultInstanceProfile-47RRMF15XFMP",
				"ImageId": "ami-1a659560",
				"InstanceType": "t2.large",
				"KeyName": { "Ref": "PemKey2" },
				"SecurityGroupIds": [{ "Ref": "CPDBSG" }, { "Ref": "NATCLIENT" }, "sg-42dc8b26"],
				"SubnetId": { "Ref": "Conf1c" },
				"BlockDeviceMappings": [
					{"DeviceName": "/dev/sda1", "Ebs": { "VolumeSize": "50", "VolumeType": "gp2" }},
					{"DeviceName": "xvdb", "Ebs": { "VolumeSize": "1", "VolumeType": "gp2" }},
					{"DeviceName": "xvdc", "Ebs": { "VolumeSize": "1", "VolumeType": "gp2" }},
					{"DeviceName": "xvdd", "Ebs": { "VolumeSize": "1", "VolumeType": "gp2" }},
					{"DeviceName": "xvde", "Ebs": { "VolumeSize": "100", "VolumeType": "gp2" }},
					{"DeviceName": "xvdf", "Ebs": { "VolumeSize": "100", "VolumeType": "gp2" }}
				],
				"Tags": [
				  { "Key" : "Name", "Value": "ms238cpodsql204" },
				  { "Key" : "Application_Id", "Value" : { "Ref": "ApplicationId" } },
				  { "Key" : "Application_Name", "Value" : { "Ref": "ApplicationName" } },
				  { "Key" : "Environment", "Value" :  { "Ref": "Environment" } },
				  { "Key" : "PO_Number", "Value" : { "Ref": "PONumber" } },
				  { "Key" : "Project_ID", "Value" : { "Ref": "ProjectId" } },
				  { "Key" : "Owner", "Value" : { "Ref": "Owner" } },
				  { "Key" : "Approver", "Value" : { "Ref": "Approver" } }
				],
				"UserData": {
					"Fn::Base64": { "Fn::Join": [ "", [
						"<powershell>\n",
						"$size = (Get-PartitionSupportedSize -DiskNumber 4 -PartitionNumber 2)\n",
						"Resize-Partition -DiskNumber 4 -PartitionNumber 2 -Size $size.SizeMax\n",
						"$size = (Get-PartitionSupportedSize -DiskNumber 5 -PartitionNumber 2)\n",
						"Resize-Partition -DiskNumber 5 -PartitionNumber 2 -Size $size.SizeMax\n",
						"Rename-Computer -NewName ms238cpodsql204 -Restart\n",
						"</powershell>"
					]]}
				}
			}
		},
		"ms238cpodsql205": {
			"Type": "AWS::EC2::Instance",
			"Properties": {
				"AvailabilityZone": "us-east-1d",
				"IamInstanceProfile": "Sysco-ApplicationDefaultInstanceProfile-47RRMF15XFMP",
				"ImageId": "ami-1a659560",
				"InstanceType": "t2.large",
				"KeyName": { "Ref": "PemKey2" },
				"SecurityGroupIds": [{ "Ref": "CPDBSG" }, { "Ref": "NATCLIENT" }, "sg-42dc8b26"],
				"SubnetId": { "Ref": "Conf1d" },
				"BlockDeviceMappings": [
					{"DeviceName": "/dev/sda1", "Ebs": { "VolumeSize": "50", "VolumeType": "gp2" }},
					{"DeviceName": "xvdb", "Ebs": { "VolumeSize": "1", "VolumeType": "gp2" }},
					{"DeviceName": "xvdc", "Ebs": { "VolumeSize": "1", "VolumeType": "gp2" }},
					{"DeviceName": "xvdd", "Ebs": { "VolumeSize": "1", "VolumeType": "gp2" }},
					{"DeviceName": "xvde", "Ebs": { "VolumeSize": "100", "VolumeType": "gp2" }},
					{"DeviceName": "xvdf", "Ebs": { "VolumeSize": "100", "VolumeType": "gp2" }}
				],
				"Tags": [
				  { "Key" : "Name", "Value": "ms238cpodsql205" },
				  { "Key" : "Application_Id", "Value" : { "Ref": "ApplicationId" } },
				  { "Key" : "Application_Name", "Value" : { "Ref": "ApplicationName" } },
				  { "Key" : "Environment", "Value" :  { "Ref": "Environment" } },
				  { "Key" : "PO_Number", "Value" : { "Ref": "PONumber" } },
				  { "Key" : "Project_ID", "Value" : { "Ref": "ProjectId" } },
				  { "Key" : "Owner", "Value" : { "Ref": "Owner" } },
				  { "Key" : "Approver", "Value" : { "Ref": "Approver" } }
				],
				"UserData": {
					"Fn::Base64": { "Fn::Join": [ "", [
						"<powershell>\n",
						"$size = (Get-PartitionSupportedSize -DiskNumber 4 -PartitionNumber 2)\n",
						"Resize-Partition -DiskNumber 4 -PartitionNumber 2 -Size $size.SizeMax\n",
						"$size = (Get-PartitionSupportedSize -DiskNumber 5 -PartitionNumber 2)\n",
						"Resize-Partition -DiskNumber 5 -PartitionNumber 2 -Size $size.SizeMax\n",
						"Rename-Computer -NewName ms238cpodsql205 -Restart\n",
						"</powershell>"
					]]}
				}
			}
		},
		"ms238cpodsql206": {
			"Type": "AWS::EC2::Instance",
			"Properties": {
				"AvailabilityZone": "us-east-1c",
				"IamInstanceProfile": "Sysco-ApplicationDefaultInstanceProfile-47RRMF15XFMP",
				"ImageId": "ami-1a659560",
				"InstanceType": "t2.large",
				"KeyName": { "Ref": "PemKey2" },
				"SecurityGroupIds": [{ "Ref": "CPDBSG" }, { "Ref": "NATCLIENT" }, "sg-42dc8b26"],
				"SubnetId": { "Ref": "Conf1c" },
				"BlockDeviceMappings": [
					{"DeviceName": "/dev/sda1", "Ebs": { "VolumeSize": "50", "VolumeType": "gp2" }},
					{"DeviceName": "xvdb", "Ebs": { "VolumeSize": "1", "VolumeType": "gp2" }},
					{"DeviceName": "xvdc", "Ebs": { "VolumeSize": "1", "VolumeType": "gp2" }},
					{"DeviceName": "xvdd", "Ebs": { "VolumeSize": "1", "VolumeType": "gp2" }},
					{"DeviceName": "xvde", "Ebs": { "VolumeSize": "100", "VolumeType": "gp2" }},
					{"DeviceName": "xvdf", "Ebs": { "VolumeSize": "100", "VolumeType": "gp2" }}
				],
				"Tags": [
				  { "Key" : "Name", "Value": "ms238cpodsql206" },
				  { "Key" : "Application_Id", "Value" : { "Ref": "ApplicationId" } },
				  { "Key" : "Application_Name", "Value" : { "Ref": "ApplicationName" } },
				  { "Key" : "Environment", "Value" :  { "Ref": "Environment" } },
				  { "Key" : "PO_Number", "Value" : { "Ref": "PONumber" } },
				  { "Key" : "Project_ID", "Value" : { "Ref": "ProjectId" } },
				  { "Key" : "Owner", "Value" : { "Ref": "Owner" } },
				  { "Key" : "Approver", "Value" : { "Ref": "Approver" } }
				],
				"UserData": {
					"Fn::Base64": { "Fn::Join": [ "", [
						"<powershell>\n",
						"$size = (Get-PartitionSupportedSize -DiskNumber 4 -PartitionNumber 2)\n",
						"Resize-Partition -DiskNumber 4 -PartitionNumber 2 -Size $size.SizeMax\n",
						"$size = (Get-PartitionSupportedSize -DiskNumber 5 -PartitionNumber 2)\n",
						"Resize-Partition -DiskNumber 5 -PartitionNumber 2 -Size $size.SizeMax\n",
						"Rename-Computer -NewName ms238cpodsql206 -Restart\n",
						"</powershell>"
					]]}
				}
			}
		},
		"ms238cpodsql207": {
			"Type": "AWS::EC2::Instance",
			"Properties": {
				"AvailabilityZone": "us-east-1d",
				"IamInstanceProfile": "Sysco-ApplicationDefaultInstanceProfile-47RRMF15XFMP",
				"ImageId": "ami-1a659560",
				"InstanceType": "t2.large",
				"KeyName": { "Ref": "PemKey2" },
				"SecurityGroupIds": [{ "Ref": "CPDBSG" }, { "Ref": "NATCLIENT" }, "sg-42dc8b26"],
				"SubnetId": { "Ref": "Conf1d" },
				"BlockDeviceMappings": [
					{"DeviceName": "/dev/sda1", "Ebs": { "VolumeSize": "50", "VolumeType": "gp2" }},
					{"DeviceName": "xvdb", "Ebs": { "VolumeSize": "1", "VolumeType": "gp2" }},
					{"DeviceName": "xvdc", "Ebs": { "VolumeSize": "1", "VolumeType": "gp2" }},
					{"DeviceName": "xvdd", "Ebs": { "VolumeSize": "1", "VolumeType": "gp2" }},
					{"DeviceName": "xvde", "Ebs": { "VolumeSize": "100", "VolumeType": "gp2" }},
					{"DeviceName": "xvdf", "Ebs": { "VolumeSize": "100", "VolumeType": "gp2" }}
				],
				"Tags": [
				  { "Key" : "Name", "Value": "ms238cpodsql207" },
				  { "Key" : "Application_Id", "Value" : { "Ref": "ApplicationId" } },
				  { "Key" : "Application_Name", "Value" : { "Ref": "ApplicationName" } },
				  { "Key" : "Environment", "Value" :  { "Ref": "Environment" } },
				  { "Key" : "PO_Number", "Value" : { "Ref": "PONumber" } },
				  { "Key" : "Project_ID", "Value" : { "Ref": "ProjectId" } },
				  { "Key" : "Owner", "Value" : { "Ref": "Owner" } },
				  { "Key" : "Approver", "Value" : { "Ref": "Approver" } }
				],
				"UserData": {
					"Fn::Base64": { "Fn::Join": [ "", [
						"<powershell>\n",
						"$size = (Get-PartitionSupportedSize -DiskNumber 4 -PartitionNumber 2)\n",
						"Resize-Partition -DiskNumber 4 -PartitionNumber 2 -Size $size.SizeMax\n",
						"$size = (Get-PartitionSupportedSize -DiskNumber 5 -PartitionNumber 2)\n",
						"Resize-Partition -DiskNumber 5 -PartitionNumber 2 -Size $size.SizeMax\n",
						"Rename-Computer -NewName ms238cpodsql207 -Restart\n",
						"</powershell>"
					]]}
				}
			}
		},
		"ms238cpodsql208": {
			"Type": "AWS::EC2::Instance",
			"Properties": {
				"AvailabilityZone": "us-east-1c",
				"IamInstanceProfile": "Sysco-ApplicationDefaultInstanceProfile-47RRMF15XFMP",
				"ImageId": "ami-1a659560",
				"InstanceType": "t2.large",
				"KeyName": { "Ref": "PemKey2" },
				"SecurityGroupIds": [{ "Ref": "CPDBSG" }, { "Ref": "NATCLIENT" }, "sg-42dc8b26"],
				"SubnetId": { "Ref": "Conf1c" },
				"BlockDeviceMappings": [
					{"DeviceName": "/dev/sda1", "Ebs": { "VolumeSize": "50", "VolumeType": "gp2" }},
					{"DeviceName": "xvdb", "Ebs": { "VolumeSize": "1", "VolumeType": "gp2" }},
					{"DeviceName": "xvdc", "Ebs": { "VolumeSize": "1", "VolumeType": "gp2" }},
					{"DeviceName": "xvdd", "Ebs": { "VolumeSize": "1", "VolumeType": "gp2" }},
					{"DeviceName": "xvde", "Ebs": { "VolumeSize": "100", "VolumeType": "gp2" }},
					{"DeviceName": "xvdf", "Ebs": { "VolumeSize": "100", "VolumeType": "gp2" }}
				],
				"Tags": [
				  { "Key" : "Name", "Value": "ms238cpodsql208" },
				  { "Key" : "Application_Id", "Value" : { "Ref": "ApplicationId" } },
				  { "Key" : "Application_Name", "Value" : { "Ref": "ApplicationName" } },
				  { "Key" : "Environment", "Value" :  { "Ref": "Environment" } },
				  { "Key" : "PO_Number", "Value" : { "Ref": "PONumber" } },
				  { "Key" : "Project_ID", "Value" : { "Ref": "ProjectId" } },
				  { "Key" : "Owner", "Value" : { "Ref": "Owner" } },
				  { "Key" : "Approver", "Value" : { "Ref": "Approver" } }
				],
				"UserData": {
					"Fn::Base64": { "Fn::Join": [ "", [
						"<powershell>\n",
						"$size = (Get-PartitionSupportedSize -DiskNumber 4 -PartitionNumber 2)\n",
						"Resize-Partition -DiskNumber 4 -PartitionNumber 2 -Size $size.SizeMax\n",
						"$size = (Get-PartitionSupportedSize -DiskNumber 5 -PartitionNumber 2)\n",
						"Resize-Partition -DiskNumber 5 -PartitionNumber 2 -Size $size.SizeMax\n",
						"Rename-Computer -NewName ms238cpodsql208 -Restart\n",
						"</powershell>"
					]]}
				}
			}
		},
		"ms238cpodsql209": {
			"Type": "AWS::EC2::Instance",
			"Properties": {
				"AvailabilityZone": "us-east-1d",
				"IamInstanceProfile": "Sysco-ApplicationDefaultInstanceProfile-47RRMF15XFMP",
				"ImageId": "ami-1a659560",
				"InstanceType": "t2.large",
				"KeyName": { "Ref": "PemKey2" },
				"SecurityGroupIds": [{ "Ref": "CPDBSG" }, { "Ref": "NATCLIENT" }, "sg-42dc8b26"],
				"SubnetId": { "Ref": "Conf1d" },
				"BlockDeviceMappings": [
					{"DeviceName": "/dev/sda1", "Ebs": { "VolumeSize": "50", "VolumeType": "gp2" }},
					{"DeviceName": "xvdb", "Ebs": { "VolumeSize": "1", "VolumeType": "gp2" }},
					{"DeviceName": "xvdc", "Ebs": { "VolumeSize": "1", "VolumeType": "gp2" }},
					{"DeviceName": "xvdd", "Ebs": { "VolumeSize": "1", "VolumeType": "gp2" }},
					{"DeviceName": "xvde", "Ebs": { "VolumeSize": "100", "VolumeType": "gp2" }},
					{"DeviceName": "xvdf", "Ebs": { "VolumeSize": "100", "VolumeType": "gp2" }}
				],
				"Tags": [
				  { "Key" : "Name", "Value": "ms238cpodsql209" },
				  { "Key" : "Application_Id", "Value" : { "Ref": "ApplicationId" } },
				  { "Key" : "Application_Name", "Value" : { "Ref": "ApplicationName" } },
				  { "Key" : "Environment", "Value" :  { "Ref": "Environment" } },
				  { "Key" : "PO_Number", "Value" : { "Ref": "PONumber" } },
				  { "Key" : "Project_ID", "Value" : { "Ref": "ProjectId" } },
				  { "Key" : "Owner", "Value" : { "Ref": "Owner" } },
				  { "Key" : "Approver", "Value" : { "Ref": "Approver" } }
				],
				"UserData": {
					"Fn::Base64": { "Fn::Join": [ "", [
						"<powershell>\n",
						"$size = (Get-PartitionSupportedSize -DiskNumber 4 -PartitionNumber 2)\n",
						"Resize-Partition -DiskNumber 4 -PartitionNumber 2 -Size $size.SizeMax\n",
						"$size = (Get-PartitionSupportedSize -DiskNumber 5 -PartitionNumber 2)\n",
						"Resize-Partition -DiskNumber 5 -PartitionNumber 2 -Size $size.SizeMax\n",
						"Rename-Computer -NewName ms238cpodsql209 -Restart\n",
						"</powershell>"
					]]}
				}
			}
		},
		"ms238cpodsql210": {
			"Type": "AWS::EC2::Instance",
			"Properties": {
				"AvailabilityZone": "us-east-1c",
				"IamInstanceProfile": "Sysco-ApplicationDefaultInstanceProfile-47RRMF15XFMP",
				"ImageId": "ami-1a659560",
				"InstanceType": "t2.large",
				"KeyName": { "Ref": "PemKey2" },
				"SecurityGroupIds": [{ "Ref": "CPDBSG" }, { "Ref": "NATCLIENT" }, "sg-42dc8b26"],
				"SubnetId": { "Ref": "Conf1c" },
				"BlockDeviceMappings": [
					{"DeviceName": "/dev/sda1", "Ebs": { "VolumeSize": "50", "VolumeType": "gp2" }},
					{"DeviceName": "xvdb", "Ebs": { "VolumeSize": "1", "VolumeType": "gp2" }},
					{"DeviceName": "xvdc", "Ebs": { "VolumeSize": "1", "VolumeType": "gp2" }},
					{"DeviceName": "xvdd", "Ebs": { "VolumeSize": "1", "VolumeType": "gp2" }},
					{"DeviceName": "xvde", "Ebs": { "VolumeSize": "100", "VolumeType": "gp2" }},
					{"DeviceName": "xvdf", "Ebs": { "VolumeSize": "100", "VolumeType": "gp2" }}
				],
				"Tags": [
				  { "Key" : "Name", "Value": "ms238cpodsql210" },
				  { "Key" : "Application_Id", "Value" : { "Ref": "ApplicationId" } },
				  { "Key" : "Application_Name", "Value" : { "Ref": "ApplicationName" } },
				  { "Key" : "Environment", "Value" :  { "Ref": "Environment" } },
				  { "Key" : "PO_Number", "Value" : { "Ref": "PONumber" } },
				  { "Key" : "Project_ID", "Value" : { "Ref": "ProjectId" } },
				  { "Key" : "Owner", "Value" : { "Ref": "Owner" } },
				  { "Key" : "Approver", "Value" : { "Ref": "Approver" } }
				],
				"UserData": {
					"Fn::Base64": { "Fn::Join": [ "", [
						"<powershell>\n",
						"$size = (Get-PartitionSupportedSize -DiskNumber 4 -PartitionNumber 2)\n",
						"Resize-Partition -DiskNumber 4 -PartitionNumber 2 -Size $size.SizeMax\n",
						"$size = (Get-PartitionSupportedSize -DiskNumber 5 -PartitionNumber 2)\n",
						"Resize-Partition -DiskNumber 5 -PartitionNumber 2 -Size $size.SizeMax\n",
						"Rename-Computer -NewName ms238cpodsql210 -Restart\n",
						"</powershell>"
					]]}
				}
			}
		},
		"ms238cpodsql211": {
			"Type": "AWS::EC2::Instance",
			"Properties": {
				"AvailabilityZone": "us-east-1d",
				"IamInstanceProfile": "Sysco-ApplicationDefaultInstanceProfile-47RRMF15XFMP",
				"ImageId": "ami-1a659560",
				"InstanceType": "t2.large",
				"KeyName": { "Ref": "PemKey2" },
				"SecurityGroupIds": [{ "Ref": "CPDBSG" }, { "Ref": "NATCLIENT" }, "sg-42dc8b26"],
				"SubnetId": { "Ref": "Conf1d" },
				"BlockDeviceMappings": [
					{"DeviceName": "/dev/sda1", "Ebs": { "VolumeSize": "50", "VolumeType": "gp2" }},
					{"DeviceName": "xvdb", "Ebs": { "VolumeSize": "1", "VolumeType": "gp2" }},
					{"DeviceName": "xvdc", "Ebs": { "VolumeSize": "1", "VolumeType": "gp2" }},
					{"DeviceName": "xvdd", "Ebs": { "VolumeSize": "1", "VolumeType": "gp2" }},
					{"DeviceName": "xvde", "Ebs": { "VolumeSize": "100", "VolumeType": "gp2" }},
					{"DeviceName": "xvdf", "Ebs": { "VolumeSize": "100", "VolumeType": "gp2" }}
				],
				"Tags": [
				  { "Key" : "Name", "Value": "ms238cpodsql211" },
				  { "Key" : "Application_Id", "Value" : { "Ref": "ApplicationId" } },
				  { "Key" : "Application_Name", "Value" : { "Ref": "ApplicationName" } },
				  { "Key" : "Environment", "Value" :  { "Ref": "Environment" } },
				  { "Key" : "PO_Number", "Value" : { "Ref": "PONumber" } },
				  { "Key" : "Project_ID", "Value" : { "Ref": "ProjectId" } },
				  { "Key" : "Owner", "Value" : { "Ref": "Owner" } },
				  { "Key" : "Approver", "Value" : { "Ref": "Approver" } }
				],
				"UserData": {
					"Fn::Base64": { "Fn::Join": [ "", [
						"<powershell>\n",
						"$size = (Get-PartitionSupportedSize -DiskNumber 4 -PartitionNumber 2)\n",
						"Resize-Partition -DiskNumber 4 -PartitionNumber 2 -Size $size.SizeMax\n",
						"$size = (Get-PartitionSupportedSize -DiskNumber 5 -PartitionNumber 2)\n",
						"Resize-Partition -DiskNumber 5 -PartitionNumber 2 -Size $size.SizeMax\n",
						"Rename-Computer -NewName ms238cpodsql211 -Restart\n",
						"</powershell>"
					]]}
				}
			}
		},
		"ms238cpodsql212": {
			"Type": "AWS::EC2::Instance",
			"Properties": {
				"AvailabilityZone": "us-east-1c",
				"IamInstanceProfile": "Sysco-ApplicationDefaultInstanceProfile-47RRMF15XFMP",
				"ImageId": "ami-1a659560",
				"InstanceType": "t2.large",
				"KeyName": { "Ref": "PemKey2" },
				"SecurityGroupIds": [{ "Ref": "CPDBSG" }, { "Ref": "NATCLIENT" }, "sg-42dc8b26"],
				"SubnetId": { "Ref": "Conf1c" },
				"BlockDeviceMappings": [
					{"DeviceName": "/dev/sda1", "Ebs": { "VolumeSize": "50", "VolumeType": "gp2" }},
					{"DeviceName": "xvdb", "Ebs": { "VolumeSize": "1", "VolumeType": "gp2" }},
					{"DeviceName": "xvdc", "Ebs": { "VolumeSize": "1", "VolumeType": "gp2" }},
					{"DeviceName": "xvdd", "Ebs": { "VolumeSize": "1", "VolumeType": "gp2" }},
					{"DeviceName": "xvde", "Ebs": { "VolumeSize": "100", "VolumeType": "gp2" }},
					{"DeviceName": "xvdf", "Ebs": { "VolumeSize": "100", "VolumeType": "gp2" }}
				],
				"Tags": [
				  { "Key" : "Name", "Value": "ms238cpodsql212" },
				  { "Key" : "Application_Id", "Value" : { "Ref": "ApplicationId" } },
				  { "Key" : "Application_Name", "Value" : { "Ref": "ApplicationName" } },
				  { "Key" : "Environment", "Value" :  { "Ref": "Environment" } },
				  { "Key" : "PO_Number", "Value" : { "Ref": "PONumber" } },
				  { "Key" : "Project_ID", "Value" : { "Ref": "ProjectId" } },
				  { "Key" : "Owner", "Value" : { "Ref": "Owner" } },
				  { "Key" : "Approver", "Value" : { "Ref": "Approver" } }
				],
				"UserData": {
					"Fn::Base64": { "Fn::Join": [ "", [
						"<powershell>\n",
						"$size = (Get-PartitionSupportedSize -DiskNumber 4 -PartitionNumber 2)\n",
						"Resize-Partition -DiskNumber 4 -PartitionNumber 2 -Size $size.SizeMax\n",
						"$size = (Get-PartitionSupportedSize -DiskNumber 5 -PartitionNumber 2)\n",
						"Resize-Partition -DiskNumber 5 -PartitionNumber 2 -Size $size.SizeMax\n",
						"Rename-Computer -NewName ms238cpodsql212 -Restart\n",
						"</powershell>"
					]]}
				}
			}
		},
		"ms238cpodsql213": {
			"Type": "AWS::EC2::Instance",
			"Properties": {
				"AvailabilityZone": "us-east-1d",
				"IamInstanceProfile": "Sysco-ApplicationDefaultInstanceProfile-47RRMF15XFMP",
				"ImageId": "ami-1a659560",
				"InstanceType": "t2.large",
				"KeyName": { "Ref": "PemKey2" },
				"SecurityGroupIds": [{ "Ref": "CPDBSG" }, { "Ref": "NATCLIENT" }, "sg-42dc8b26"],
				"SubnetId": { "Ref": "Conf1d" },
				"BlockDeviceMappings": [
					{"DeviceName": "/dev/sda1", "Ebs": { "VolumeSize": "50", "VolumeType": "gp2" }},
					{"DeviceName": "xvdb", "Ebs": { "VolumeSize": "1", "VolumeType": "gp2" }},
					{"DeviceName": "xvdc", "Ebs": { "VolumeSize": "1", "VolumeType": "gp2" }},
					{"DeviceName": "xvdd", "Ebs": { "VolumeSize": "1", "VolumeType": "gp2" }},
					{"DeviceName": "xvde", "Ebs": { "VolumeSize": "100", "VolumeType": "gp2" }},
					{"DeviceName": "xvdf", "Ebs": { "VolumeSize": "100", "VolumeType": "gp2" }}
				],
				"Tags": [
				  { "Key" : "Name", "Value": "ms238cpodsql213" },
				  { "Key" : "Application_Id", "Value" : { "Ref": "ApplicationId" } },
				  { "Key" : "Application_Name", "Value" : { "Ref": "ApplicationName" } },
				  { "Key" : "Environment", "Value" :  { "Ref": "Environment" } },
				  { "Key" : "PO_Number", "Value" : { "Ref": "PONumber" } },
				  { "Key" : "Project_ID", "Value" : { "Ref": "ProjectId" } },
				  { "Key" : "Owner", "Value" : { "Ref": "Owner" } },
				  { "Key" : "Approver", "Value" : { "Ref": "Approver" } }
				],
				"UserData": {
					"Fn::Base64": { "Fn::Join": [ "", [
						"<powershell>\n",
						"$size = (Get-PartitionSupportedSize -DiskNumber 4 -PartitionNumber 2)\n",
						"Resize-Partition -DiskNumber 4 -PartitionNumber 2 -Size $size.SizeMax\n",
						"$size = (Get-PartitionSupportedSize -DiskNumber 5 -PartitionNumber 2)\n",
						"Resize-Partition -DiskNumber 5 -PartitionNumber 2 -Size $size.SizeMax\n",
						"Rename-Computer -NewName ms238cpodsql213 -Restart\n",
						"</powershell>"
					]]}
				}
			}
		},
		"ms238cpodsql214": {
			"Type": "AWS::EC2::Instance",
			"Properties": {
				"AvailabilityZone": "us-east-1c",
				"IamInstanceProfile": "Sysco-ApplicationDefaultInstanceProfile-47RRMF15XFMP",
				"ImageId": "ami-1a659560",
				"InstanceType": "t2.large",
				"KeyName": { "Ref": "PemKey2" },
				"SecurityGroupIds": [{ "Ref": "CPDBSG" }, { "Ref": "NATCLIENT" }, "sg-42dc8b26"],
				"SubnetId": { "Ref": "Conf1c" },
				"BlockDeviceMappings": [
					{"DeviceName": "/dev/sda1", "Ebs": { "VolumeSize": "50", "VolumeType": "gp2" }},
					{"DeviceName": "xvdb", "Ebs": { "VolumeSize": "1", "VolumeType": "gp2" }},
					{"DeviceName": "xvdc", "Ebs": { "VolumeSize": "1", "VolumeType": "gp2" }},
					{"DeviceName": "xvdd", "Ebs": { "VolumeSize": "1", "VolumeType": "gp2" }},
					{"DeviceName": "xvde", "Ebs": { "VolumeSize": "100", "VolumeType": "gp2" }},
					{"DeviceName": "xvdf", "Ebs": { "VolumeSize": "100", "VolumeType": "gp2" }}
				],
				"Tags": [
				  { "Key" : "Name", "Value": "ms238cpodsql214" },
				  { "Key" : "Application_Id", "Value" : { "Ref": "ApplicationId" } },
				  { "Key" : "Application_Name", "Value" : { "Ref": "ApplicationName" } },
				  { "Key" : "Environment", "Value" :  { "Ref": "Environment" } },
				  { "Key" : "PO_Number", "Value" : { "Ref": "PONumber" } },
				  { "Key" : "Project_ID", "Value" : { "Ref": "ProjectId" } },
				  { "Key" : "Owner", "Value" : { "Ref": "Owner" } },
				  { "Key" : "Approver", "Value" : { "Ref": "Approver" } }
				],
				"UserData": {
					"Fn::Base64": { "Fn::Join": [ "", [
						"<powershell>\n",
						"$size = (Get-PartitionSupportedSize -DiskNumber 4 -PartitionNumber 2)\n",
						"Resize-Partition -DiskNumber 4 -PartitionNumber 2 -Size $size.SizeMax\n",
						"$size = (Get-PartitionSupportedSize -DiskNumber 5 -PartitionNumber 2)\n",
						"Resize-Partition -DiskNumber 5 -PartitionNumber 2 -Size $size.SizeMax\n",
						"Rename-Computer -NewName ms238cpodsql214 -Restart\n",
						"</powershell>"
					]]}
				}
			}
		},
		"ms238cpodsql215": {
			"Type": "AWS::EC2::Instance",
			"Properties": {
				"AvailabilityZone": "us-east-1d",
				"IamInstanceProfile": "Sysco-ApplicationDefaultInstanceProfile-47RRMF15XFMP",
				"ImageId": "ami-1a659560",
				"InstanceType": "t2.large",
				"KeyName": { "Ref": "PemKey2" },
				"SecurityGroupIds": [{ "Ref": "CPDBSG" }, { "Ref": "NATCLIENT" }, "sg-42dc8b26"],
				"SubnetId": { "Ref": "Conf1d" },
				"BlockDeviceMappings": [
					{"DeviceName": "/dev/sda1", "Ebs": { "VolumeSize": "50", "VolumeType": "gp2" }},
					{"DeviceName": "xvdb", "Ebs": { "VolumeSize": "1", "VolumeType": "gp2" }},
					{"DeviceName": "xvdc", "Ebs": { "VolumeSize": "1", "VolumeType": "gp2" }},
					{"DeviceName": "xvdd", "Ebs": { "VolumeSize": "1", "VolumeType": "gp2" }},
					{"DeviceName": "xvde", "Ebs": { "VolumeSize": "100", "VolumeType": "gp2" }},
					{"DeviceName": "xvdf", "Ebs": { "VolumeSize": "100", "VolumeType": "gp2" }}
				],
				"Tags": [
				  { "Key" : "Name", "Value": "ms238cpodsql215" },
				  { "Key" : "Application_Id", "Value" : { "Ref": "ApplicationId" } },
				  { "Key" : "Application_Name", "Value" : { "Ref": "ApplicationName" } },
				  { "Key" : "Environment", "Value" :  { "Ref": "Environment" } },
				  { "Key" : "PO_Number", "Value" : { "Ref": "PONumber" } },
				  { "Key" : "Project_ID", "Value" : { "Ref": "ProjectId" } },
				  { "Key" : "Owner", "Value" : { "Ref": "Owner" } },
				  { "Key" : "Approver", "Value" : { "Ref": "Approver" } }
				],
				"UserData": {
					"Fn::Base64": { "Fn::Join": [ "", [
						"<powershell>\n",
						"$size = (Get-PartitionSupportedSize -DiskNumber 4 -PartitionNumber 2)\n",
						"Resize-Partition -DiskNumber 4 -PartitionNumber 2 -Size $size.SizeMax\n",
						"$size = (Get-PartitionSupportedSize -DiskNumber 5 -PartitionNumber 2)\n",
						"Resize-Partition -DiskNumber 5 -PartitionNumber 2 -Size $size.SizeMax\n",
						"Rename-Computer -NewName ms238cpodsql215 -Restart\n",
						"</powershell>"
					]]}
				}
			}
		},
		"ms238cpodsql216": {
			"Type": "AWS::EC2::Instance",
			"Properties": {
				"AvailabilityZone": "us-east-1c",
				"IamInstanceProfile": "Sysco-ApplicationDefaultInstanceProfile-47RRMF15XFMP",
				"ImageId": "ami-1a659560",
				"InstanceType": "t2.large",
				"KeyName": { "Ref": "PemKey2" },
				"SecurityGroupIds": [{ "Ref": "CPDBSG" }, { "Ref": "NATCLIENT" }, "sg-42dc8b26"],
				"SubnetId": { "Ref": "Conf1c" },
				"BlockDeviceMappings": [
					{"DeviceName": "/dev/sda1", "Ebs": { "VolumeSize": "50", "VolumeType": "gp2" }},
					{"DeviceName": "xvdb", "Ebs": { "VolumeSize": "1", "VolumeType": "gp2" }},
					{"DeviceName": "xvdc", "Ebs": { "VolumeSize": "1", "VolumeType": "gp2" }},
					{"DeviceName": "xvdd", "Ebs": { "VolumeSize": "1", "VolumeType": "gp2" }},
					{"DeviceName": "xvde", "Ebs": { "VolumeSize": "100", "VolumeType": "gp2" }},
					{"DeviceName": "xvdf", "Ebs": { "VolumeSize": "100", "VolumeType": "gp2" }}
				],
				"Tags": [
				  { "Key" : "Name", "Value": "ms238cpodsql216" },
				  { "Key" : "Application_Id", "Value" : { "Ref": "ApplicationId" } },
				  { "Key" : "Application_Name", "Value" : { "Ref": "ApplicationName" } },
				  { "Key" : "Environment", "Value" :  { "Ref": "Environment" } },
				  { "Key" : "PO_Number", "Value" : { "Ref": "PONumber" } },
				  { "Key" : "Project_ID", "Value" : { "Ref": "ProjectId" } },
				  { "Key" : "Owner", "Value" : { "Ref": "Owner" } },
				  { "Key" : "Approver", "Value" : { "Ref": "Approver" } }
				],
				"UserData": {
					"Fn::Base64": { "Fn::Join": [ "", [
						"<powershell>\n",
						"$size = (Get-PartitionSupportedSize -DiskNumber 4 -PartitionNumber 2)\n",
						"Resize-Partition -DiskNumber 4 -PartitionNumber 2 -Size $size.SizeMax\n",
						"$size = (Get-PartitionSupportedSize -DiskNumber 5 -PartitionNumber 2)\n",
						"Resize-Partition -DiskNumber 5 -PartitionNumber 2 -Size $size.SizeMax\n",
						"Rename-Computer -NewName ms238cpodsql216 -Restart\n",
						"</powershell>"
					]]}
				}
			}
		},
		"ms238cpodsql217": {
			"Type": "AWS::EC2::Instance",
			"Properties": {
				"AvailabilityZone": "us-east-1d",
				"IamInstanceProfile": "Sysco-ApplicationDefaultInstanceProfile-47RRMF15XFMP",
				"ImageId": "ami-1a659560",
				"InstanceType": "t2.large",
				"KeyName": { "Ref": "PemKey2" },
				"SecurityGroupIds": [{ "Ref": "CPDBSG" }, { "Ref": "NATCLIENT" }, "sg-42dc8b26"],
				"SubnetId": { "Ref": "Conf1d" },
				"BlockDeviceMappings": [
					{"DeviceName": "/dev/sda1", "Ebs": { "VolumeSize": "50", "VolumeType": "gp2" }},
					{"DeviceName": "xvdb", "Ebs": { "VolumeSize": "1", "VolumeType": "gp2" }},
					{"DeviceName": "xvdc", "Ebs": { "VolumeSize": "1", "VolumeType": "gp2" }},
					{"DeviceName": "xvdd", "Ebs": { "VolumeSize": "1", "VolumeType": "gp2" }},
					{"DeviceName": "xvde", "Ebs": { "VolumeSize": "100", "VolumeType": "gp2" }},
					{"DeviceName": "xvdf", "Ebs": { "VolumeSize": "100", "VolumeType": "gp2" }}
				],
				"Tags": [
				  { "Key" : "Name", "Value": "ms238cpodsql217" },
				  { "Key" : "Application_Id", "Value" : { "Ref": "ApplicationId" } },
				  { "Key" : "Application_Name", "Value" : { "Ref": "ApplicationName" } },
				  { "Key" : "Environment", "Value" :  { "Ref": "Environment" } },
				  { "Key" : "PO_Number", "Value" : { "Ref": "PONumber" } },
				  { "Key" : "Project_ID", "Value" : { "Ref": "ProjectId" } },
				  { "Key" : "Owner", "Value" : { "Ref": "Owner" } },
				  { "Key" : "Approver", "Value" : { "Ref": "Approver" } }
				],
				"UserData": {
					"Fn::Base64": { "Fn::Join": [ "", [
						"<powershell>\n",
						"$size = (Get-PartitionSupportedSize -DiskNumber 4 -PartitionNumber 2)\n",
						"Resize-Partition -DiskNumber 4 -PartitionNumber 2 -Size $size.SizeMax\n",
						"$size = (Get-PartitionSupportedSize -DiskNumber 5 -PartitionNumber 2)\n",
						"Resize-Partition -DiskNumber 5 -PartitionNumber 2 -Size $size.SizeMax\n",
						"Rename-Computer -NewName ms238cpodsql217 -Restart\n",
						"</powershell>"
					]]}
				}
			}
		},
		"ms238cpodsql218": {
			"Type": "AWS::EC2::Instance",
			"Properties": {
				"AvailabilityZone": "us-east-1c",
				"IamInstanceProfile": "Sysco-ApplicationDefaultInstanceProfile-47RRMF15XFMP",
				"ImageId": "ami-1a659560",
				"InstanceType": "t2.large",
				"KeyName": { "Ref": "PemKey2" },
				"SecurityGroupIds": [{ "Ref": "CPDBSG" }, { "Ref": "NATCLIENT" }, "sg-42dc8b26"],
				"SubnetId": { "Ref": "Conf1c" },
				"BlockDeviceMappings": [
					{"DeviceName": "/dev/sda1", "Ebs": { "VolumeSize": "50", "VolumeType": "gp2" }},
					{"DeviceName": "xvdb", "Ebs": { "VolumeSize": "1", "VolumeType": "gp2" }},
					{"DeviceName": "xvdc", "Ebs": { "VolumeSize": "1", "VolumeType": "gp2" }},
					{"DeviceName": "xvdd", "Ebs": { "VolumeSize": "1", "VolumeType": "gp2" }},
					{"DeviceName": "xvde", "Ebs": { "VolumeSize": "100", "VolumeType": "gp2" }},
					{"DeviceName": "xvdf", "Ebs": { "VolumeSize": "100", "VolumeType": "gp2" }}
				],
				"Tags": [
				  { "Key" : "Name", "Value": "ms238cpodsql218" },
				  { "Key" : "Application_Id", "Value" : { "Ref": "ApplicationId" } },
				  { "Key" : "Application_Name", "Value" : { "Ref": "ApplicationName" } },
				  { "Key" : "Environment", "Value" :  { "Ref": "Environment" } },
				  { "Key" : "PO_Number", "Value" : { "Ref": "PONumber" } },
				  { "Key" : "Project_ID", "Value" : { "Ref": "ProjectId" } },
				  { "Key" : "Owner", "Value" : { "Ref": "Owner" } },
				  { "Key" : "Approver", "Value" : { "Ref": "Approver" } }
				],
				"UserData": {
					"Fn::Base64": { "Fn::Join": [ "", [
						"<powershell>\n",
						"$size = (Get-PartitionSupportedSize -DiskNumber 4 -PartitionNumber 2)\n",
						"Resize-Partition -DiskNumber 4 -PartitionNumber 2 -Size $size.SizeMax\n",
						"$size = (Get-PartitionSupportedSize -DiskNumber 5 -PartitionNumber 2)\n",
						"Resize-Partition -DiskNumber 5 -PartitionNumber 2 -Size $size.SizeMax\n",
						"Rename-Computer -NewName ms238cpodsql218 -Restart\n",
						"</powershell>"
					]]}
				}
			}
		},
		"ms238cpodsql219": {
			"Type": "AWS::EC2::Instance",
			"Properties": {
				"AvailabilityZone": "us-east-1d",
				"IamInstanceProfile": "Sysco-ApplicationDefaultInstanceProfile-47RRMF15XFMP",
				"ImageId": "ami-1a659560",
				"InstanceType": "t2.large",
				"KeyName": { "Ref": "PemKey2" },
				"SecurityGroupIds": [{ "Ref": "CPDBSG" }, { "Ref": "NATCLIENT" }, "sg-42dc8b26"],
				"SubnetId": { "Ref": "Conf1d" },
				"BlockDeviceMappings": [
					{"DeviceName": "/dev/sda1", "Ebs": { "VolumeSize": "50", "VolumeType": "gp2" }},
					{"DeviceName": "xvdb", "Ebs": { "VolumeSize": "1", "VolumeType": "gp2" }},
					{"DeviceName": "xvdc", "Ebs": { "VolumeSize": "1", "VolumeType": "gp2" }},
					{"DeviceName": "xvdd", "Ebs": { "VolumeSize": "1", "VolumeType": "gp2" }},
					{"DeviceName": "xvde", "Ebs": { "VolumeSize": "100", "VolumeType": "gp2" }},
					{"DeviceName": "xvdf", "Ebs": { "VolumeSize": "100", "VolumeType": "gp2" }}
				],
				"Tags": [
				  { "Key" : "Name", "Value": "ms238cpodsql219" },
				  { "Key" : "Application_Id", "Value" : { "Ref": "ApplicationId" } },
				  { "Key" : "Application_Name", "Value" : { "Ref": "ApplicationName" } },
				  { "Key" : "Environment", "Value" :  { "Ref": "Environment" } },
				  { "Key" : "PO_Number", "Value" : { "Ref": "PONumber" } },
				  { "Key" : "Project_ID", "Value" : { "Ref": "ProjectId" } },
				  { "Key" : "Owner", "Value" : { "Ref": "Owner" } },
				  { "Key" : "Approver", "Value" : { "Ref": "Approver" } }
				],
				"UserData": {
					"Fn::Base64": { "Fn::Join": [ "", [
						"<powershell>\n",
						"$size = (Get-PartitionSupportedSize -DiskNumber 4 -PartitionNumber 2)\n",
						"Resize-Partition -DiskNumber 4 -PartitionNumber 2 -Size $size.SizeMax\n",
						"$size = (Get-PartitionSupportedSize -DiskNumber 5 -PartitionNumber 2)\n",
						"Resize-Partition -DiskNumber 5 -PartitionNumber 2 -Size $size.SizeMax\n",
						"Rename-Computer -NewName ms238cpodsql219 -Restart\n",
						"</powershell>"
					]]}
				}
			}
		},
		"ms238cpodsql220": {
			"Type": "AWS::EC2::Instance",
			"Properties": {
				"AvailabilityZone": "us-east-1c",
				"IamInstanceProfile": "Sysco-ApplicationDefaultInstanceProfile-47RRMF15XFMP",
				"ImageId": "ami-1a659560",
				"InstanceType": "t2.large",
				"KeyName": { "Ref": "PemKey2" },
				"SecurityGroupIds": [{ "Ref": "CPDBSG" }, { "Ref": "NATCLIENT" }, "sg-42dc8b26"],
				"SubnetId": { "Ref": "Conf1c" },
				"BlockDeviceMappings": [
					{"DeviceName": "/dev/sda1", "Ebs": { "VolumeSize": "50", "VolumeType": "gp2" }},
					{"DeviceName": "xvdb", "Ebs": { "VolumeSize": "1", "VolumeType": "gp2" }},
					{"DeviceName": "xvdc", "Ebs": { "VolumeSize": "1", "VolumeType": "gp2" }},
					{"DeviceName": "xvdd", "Ebs": { "VolumeSize": "1", "VolumeType": "gp2" }},
					{"DeviceName": "xvde", "Ebs": { "VolumeSize": "100", "VolumeType": "gp2" }},
					{"DeviceName": "xvdf", "Ebs": { "VolumeSize": "100", "VolumeType": "gp2" }}
				],
				"Tags": [
				  { "Key" : "Name", "Value": "ms238cpodsql220" },
				  { "Key" : "Application_Id", "Value" : { "Ref": "ApplicationId" } },
				  { "Key" : "Application_Name", "Value" : { "Ref": "ApplicationName" } },
				  { "Key" : "Environment", "Value" :  { "Ref": "Environment" } },
				  { "Key" : "PO_Number", "Value" : { "Ref": "PONumber" } },
				  { "Key" : "Project_ID", "Value" : { "Ref": "ProjectId" } },
				  { "Key" : "Owner", "Value" : { "Ref": "Owner" } },
				  { "Key" : "Approver", "Value" : { "Ref": "Approver" } }
				],
				"UserData": {
					"Fn::Base64": { "Fn::Join": [ "", [
						"<powershell>\n",
						"$size = (Get-PartitionSupportedSize -DiskNumber 4 -PartitionNumber 2)\n",
						"Resize-Partition -DiskNumber 4 -PartitionNumber 2 -Size $size.SizeMax\n",
						"$size = (Get-PartitionSupportedSize -DiskNumber 5 -PartitionNumber 2)\n",
						"Resize-Partition -DiskNumber 5 -PartitionNumber 2 -Size $size.SizeMax\n",
						"Rename-Computer -NewName ms238cpodsql220 -Restart\n",
						"</powershell>"
					]]}
				}
			}
		},
		"ms238cpodsql221": {
			"Type": "AWS::EC2::Instance",
			"Properties": {
				"AvailabilityZone": "us-east-1d",
				"IamInstanceProfile": "Sysco-ApplicationDefaultInstanceProfile-47RRMF15XFMP",
				"ImageId": "ami-1a659560",
				"InstanceType": "t2.large",
				"KeyName": { "Ref": "PemKey2" },
				"SecurityGroupIds": [{ "Ref": "CPDBSG" }, { "Ref": "NATCLIENT" }, "sg-42dc8b26"],
				"SubnetId": { "Ref": "Conf1d" },
				"BlockDeviceMappings": [
					{"DeviceName": "/dev/sda1", "Ebs": { "VolumeSize": "50", "VolumeType": "gp2" }},
					{"DeviceName": "xvdb", "Ebs": { "VolumeSize": "1", "VolumeType": "gp2" }},
					{"DeviceName": "xvdc", "Ebs": { "VolumeSize": "1", "VolumeType": "gp2" }},
					{"DeviceName": "xvdd", "Ebs": { "VolumeSize": "1", "VolumeType": "gp2" }},
					{"DeviceName": "xvde", "Ebs": { "VolumeSize": "100", "VolumeType": "gp2" }},
					{"DeviceName": "xvdf", "Ebs": { "VolumeSize": "100", "VolumeType": "gp2" }}
				],
				"Tags": [
				  { "Key" : "Name", "Value": "ms238cpodsql221" },
				  { "Key" : "Application_Id", "Value" : { "Ref": "ApplicationId" } },
				  { "Key" : "Application_Name", "Value" : { "Ref": "ApplicationName" } },
				  { "Key" : "Environment", "Value" :  { "Ref": "Environment" } },
				  { "Key" : "PO_Number", "Value" : { "Ref": "PONumber" } },
				  { "Key" : "Project_ID", "Value" : { "Ref": "ProjectId" } },
				  { "Key" : "Owner", "Value" : { "Ref": "Owner" } },
				  { "Key" : "Approver", "Value" : { "Ref": "Approver" } }
				],
				"UserData": {
					"Fn::Base64": { "Fn::Join": [ "", [
						"<powershell>\n",
						"$size = (Get-PartitionSupportedSize -DiskNumber 4 -PartitionNumber 2)\n",
						"Resize-Partition -DiskNumber 4 -PartitionNumber 2 -Size $size.SizeMax\n",
						"$size = (Get-PartitionSupportedSize -DiskNumber 5 -PartitionNumber 2)\n",
						"Resize-Partition -DiskNumber 5 -PartitionNumber 2 -Size $size.SizeMax\n",
						"Rename-Computer -NewName ms238cpodsql221 -Restart\n",
						"</powershell>"
					]]}
				}
			}
		},
		"ms238cpodsql222": {
			"Type": "AWS::EC2::Instance",
			"Properties": {
				"AvailabilityZone": "us-east-1c",
				"IamInstanceProfile": "Sysco-ApplicationDefaultInstanceProfile-47RRMF15XFMP",
				"ImageId": "ami-1a659560",
				"InstanceType": "t2.large",
				"KeyName": { "Ref": "PemKey2" },
				"SecurityGroupIds": [{ "Ref": "CPDBSG" }, { "Ref": "NATCLIENT" }, "sg-42dc8b26"],
				"SubnetId": { "Ref": "Conf1c" },
				"BlockDeviceMappings": [
					{"DeviceName": "/dev/sda1", "Ebs": { "VolumeSize": "50", "VolumeType": "gp2" }},
					{"DeviceName": "xvdb", "Ebs": { "VolumeSize": "1", "VolumeType": "gp2" }},
					{"DeviceName": "xvdc", "Ebs": { "VolumeSize": "1", "VolumeType": "gp2" }},
					{"DeviceName": "xvdd", "Ebs": { "VolumeSize": "1", "VolumeType": "gp2" }},
					{"DeviceName": "xvde", "Ebs": { "VolumeSize": "100", "VolumeType": "gp2" }},
					{"DeviceName": "xvdf", "Ebs": { "VolumeSize": "100", "VolumeType": "gp2" }}
				],
				"Tags": [
				  { "Key" : "Name", "Value": "ms238cpodsql222" },
				  { "Key" : "Application_Id", "Value" : { "Ref": "ApplicationId" } },
				  { "Key" : "Application_Name", "Value" : { "Ref": "ApplicationName" } },
				  { "Key" : "Environment", "Value" :  { "Ref": "Environment" } },
				  { "Key" : "PO_Number", "Value" : { "Ref": "PONumber" } },
				  { "Key" : "Project_ID", "Value" : { "Ref": "ProjectId" } },
				  { "Key" : "Owner", "Value" : { "Ref": "Owner" } },
				  { "Key" : "Approver", "Value" : { "Ref": "Approver" } }
				],
				"UserData": {
					"Fn::Base64": { "Fn::Join": [ "", [
						"<powershell>\n",
						"$size = (Get-PartitionSupportedSize -DiskNumber 4 -PartitionNumber 2)\n",
						"Resize-Partition -DiskNumber 4 -PartitionNumber 2 -Size $size.SizeMax\n",
						"$size = (Get-PartitionSupportedSize -DiskNumber 5 -PartitionNumber 2)\n",
						"Resize-Partition -DiskNumber 5 -PartitionNumber 2 -Size $size.SizeMax\n",
						"Rename-Computer -NewName ms238cpodsql222 -Restart\n",
						"</powershell>"
					]]}
				}
			}
		},
		"ms238cpodsql223": {
			"Type": "AWS::EC2::Instance",
			"Properties": {
				"AvailabilityZone": "us-east-1d",
				"IamInstanceProfile": "Sysco-ApplicationDefaultInstanceProfile-47RRMF15XFMP",
				"ImageId": "ami-1a659560",
				"InstanceType": "t2.large",
				"KeyName": { "Ref": "PemKey2" },
				"SecurityGroupIds": [{ "Ref": "CPDBSG" }, { "Ref": "NATCLIENT" }, "sg-42dc8b26"],
				"SubnetId": { "Ref": "Conf1d" },
				"BlockDeviceMappings": [
					{"DeviceName": "/dev/sda1", "Ebs": { "VolumeSize": "50", "VolumeType": "gp2" }},
					{"DeviceName": "xvdb", "Ebs": { "VolumeSize": "1", "VolumeType": "gp2" }},
					{"DeviceName": "xvdc", "Ebs": { "VolumeSize": "1", "VolumeType": "gp2" }},
					{"DeviceName": "xvdd", "Ebs": { "VolumeSize": "1", "VolumeType": "gp2" }},
					{"DeviceName": "xvde", "Ebs": { "VolumeSize": "100", "VolumeType": "gp2" }},
					{"DeviceName": "xvdf", "Ebs": { "VolumeSize": "100", "VolumeType": "gp2" }}
				],
				"Tags": [
				  { "Key" : "Name", "Value": "ms238cpodsql223" },
				  { "Key" : "Application_Id", "Value" : { "Ref": "ApplicationId" } },
				  { "Key" : "Application_Name", "Value" : { "Ref": "ApplicationName" } },
				  { "Key" : "Environment", "Value" :  { "Ref": "Environment" } },
				  { "Key" : "PO_Number", "Value" : { "Ref": "PONumber" } },
				  { "Key" : "Project_ID", "Value" : { "Ref": "ProjectId" } },
				  { "Key" : "Owner", "Value" : { "Ref": "Owner" } },
				  { "Key" : "Approver", "Value" : { "Ref": "Approver" } }
				],
				"UserData": {
					"Fn::Base64": { "Fn::Join": [ "", [
						"<powershell>\n",
						"$size = (Get-PartitionSupportedSize -DiskNumber 4 -PartitionNumber 2)\n",
						"Resize-Partition -DiskNumber 4 -PartitionNumber 2 -Size $size.SizeMax\n",
						"$size = (Get-PartitionSupportedSize -DiskNumber 5 -PartitionNumber 2)\n",
						"Resize-Partition -DiskNumber 5 -PartitionNumber 2 -Size $size.SizeMax\n",
						"Rename-Computer -NewName ms238cpodsql223 -Restart\n",
						"</powershell>"
					]]}
				}
			}
		},
		"ms238cpodsql224": {
			"Type": "AWS::EC2::Instance",
			"Properties": {
				"AvailabilityZone": "us-east-1c",
				"IamInstanceProfile": "Sysco-ApplicationDefaultInstanceProfile-47RRMF15XFMP",
				"ImageId": "ami-1a659560",
				"InstanceType": "t2.large",
				"KeyName": { "Ref": "PemKey2" },
				"SecurityGroupIds": [{ "Ref": "CPDBSG" }, { "Ref": "NATCLIENT" }, "sg-42dc8b26"],
				"SubnetId": { "Ref": "Conf1c" },
				"BlockDeviceMappings": [
					{"DeviceName": "/dev/sda1", "Ebs": { "VolumeSize": "50", "VolumeType": "gp2" }},
					{"DeviceName": "xvdb", "Ebs": { "VolumeSize": "1", "VolumeType": "gp2" }},
					{"DeviceName": "xvdc", "Ebs": { "VolumeSize": "1", "VolumeType": "gp2" }},
					{"DeviceName": "xvdd", "Ebs": { "VolumeSize": "1", "VolumeType": "gp2" }},
					{"DeviceName": "xvde", "Ebs": { "VolumeSize": "100", "VolumeType": "gp2" }},
					{"DeviceName": "xvdf", "Ebs": { "VolumeSize": "100", "VolumeType": "gp2" }}
				],
				"Tags": [
				  { "Key" : "Name", "Value": "ms238cpodsql224" },
				  { "Key" : "Application_Id", "Value" : { "Ref": "ApplicationId" } },
				  { "Key" : "Application_Name", "Value" : { "Ref": "ApplicationName" } },
				  { "Key" : "Environment", "Value" :  { "Ref": "Environment" } },
				  { "Key" : "PO_Number", "Value" : { "Ref": "PONumber" } },
				  { "Key" : "Project_ID", "Value" : { "Ref": "ProjectId" } },
				  { "Key" : "Owner", "Value" : { "Ref": "Owner" } },
				  { "Key" : "Approver", "Value" : { "Ref": "Approver" } }
				],
				"UserData": {
					"Fn::Base64": { "Fn::Join": [ "", [
						"<powershell>\n",
						"$size = (Get-PartitionSupportedSize -DiskNumber 4 -PartitionNumber 2)\n",
						"Resize-Partition -DiskNumber 4 -PartitionNumber 2 -Size $size.SizeMax\n",
						"$size = (Get-PartitionSupportedSize -DiskNumber 5 -PartitionNumber 2)\n",
						"Resize-Partition -DiskNumber 5 -PartitionNumber 2 -Size $size.SizeMax\n",
						"Rename-Computer -NewName ms238cpodsql224 -Restart\n",
						"</powershell>"
					]]}
				}
			}
		},
		"ms238cpodsql225": {
			"Type": "AWS::EC2::Instance",
			"Properties": {
				"AvailabilityZone": "us-east-1d",
				"IamInstanceProfile": "Sysco-ApplicationDefaultInstanceProfile-47RRMF15XFMP",
				"ImageId": "ami-1a659560",
				"InstanceType": "t2.large",
				"KeyName": { "Ref": "PemKey2" },
				"SecurityGroupIds": [{ "Ref": "CPDBSG" }, { "Ref": "NATCLIENT" }, "sg-42dc8b26"],
				"SubnetId": { "Ref": "Conf1d" },
				"BlockDeviceMappings": [
					{"DeviceName": "/dev/sda1", "Ebs": { "VolumeSize": "50", "VolumeType": "gp2" }},
					{"DeviceName": "xvdb", "Ebs": { "VolumeSize": "1", "VolumeType": "gp2" }},
					{"DeviceName": "xvdc", "Ebs": { "VolumeSize": "1", "VolumeType": "gp2" }},
					{"DeviceName": "xvdd", "Ebs": { "VolumeSize": "1", "VolumeType": "gp2" }},
					{"DeviceName": "xvde", "Ebs": { "VolumeSize": "100", "VolumeType": "gp2" }},
					{"DeviceName": "xvdf", "Ebs": { "VolumeSize": "100", "VolumeType": "gp2" }}
				],
				"Tags": [
				  { "Key" : "Name", "Value": "ms238cpodsql225" },
				  { "Key" : "Application_Id", "Value" : { "Ref": "ApplicationId" } },
				  { "Key" : "Application_Name", "Value" : { "Ref": "ApplicationName" } },
				  { "Key" : "Environment", "Value" :  { "Ref": "Environment" } },
				  { "Key" : "PO_Number", "Value" : { "Ref": "PONumber" } },
				  { "Key" : "Project_ID", "Value" : { "Ref": "ProjectId" } },
				  { "Key" : "Owner", "Value" : { "Ref": "Owner" } },
				  { "Key" : "Approver", "Value" : { "Ref": "Approver" } }
				],
				"UserData": {
					"Fn::Base64": { "Fn::Join": [ "", [
						"<powershell>\n",
						"$size = (Get-PartitionSupportedSize -DiskNumber 4 -PartitionNumber 2)\n",
						"Resize-Partition -DiskNumber 4 -PartitionNumber 2 -Size $size.SizeMax\n",
						"$size = (Get-PartitionSupportedSize -DiskNumber 5 -PartitionNumber 2)\n",
						"Resize-Partition -DiskNumber 5 -PartitionNumber 2 -Size $size.SizeMax\n",
						"Rename-Computer -NewName ms238cpodsql225 -Restart\n",
						"</powershell>"
					]]}
				}
			}
		},
		"ms238cpodsql226": {
			"Type": "AWS::EC2::Instance",
			"Properties": {
				"AvailabilityZone": "us-east-1c",
				"IamInstanceProfile": "Sysco-ApplicationDefaultInstanceProfile-47RRMF15XFMP",
				"ImageId": "ami-1a659560",
				"InstanceType": "t2.large",
				"KeyName": { "Ref": "PemKey2" },
				"SecurityGroupIds": [{ "Ref": "CPDBSG" }, { "Ref": "NATCLIENT" }, "sg-42dc8b26"],
				"SubnetId": { "Ref": "Conf1c" },
				"BlockDeviceMappings": [
					{"DeviceName": "/dev/sda1", "Ebs": { "VolumeSize": "50", "VolumeType": "gp2" }},
					{"DeviceName": "xvdb", "Ebs": { "VolumeSize": "1", "VolumeType": "gp2" }},
					{"DeviceName": "xvdc", "Ebs": { "VolumeSize": "1", "VolumeType": "gp2" }},
					{"DeviceName": "xvdd", "Ebs": { "VolumeSize": "1", "VolumeType": "gp2" }},
					{"DeviceName": "xvde", "Ebs": { "VolumeSize": "100", "VolumeType": "gp2" }},
					{"DeviceName": "xvdf", "Ebs": { "VolumeSize": "100", "VolumeType": "gp2" }}
				],
				"Tags": [
				  { "Key" : "Name", "Value": "ms238cpodsql226" },
				  { "Key" : "Application_Id", "Value" : { "Ref": "ApplicationId" } },
				  { "Key" : "Application_Name", "Value" : { "Ref": "ApplicationName" } },
				  { "Key" : "Environment", "Value" :  { "Ref": "Environment" } },
				  { "Key" : "PO_Number", "Value" : { "Ref": "PONumber" } },
				  { "Key" : "Project_ID", "Value" : { "Ref": "ProjectId" } },
				  { "Key" : "Owner", "Value" : { "Ref": "Owner" } },
				  { "Key" : "Approver", "Value" : { "Ref": "Approver" } }
				],
				"UserData": {
					"Fn::Base64": { "Fn::Join": [ "", [
						"<powershell>\n",
						"$size = (Get-PartitionSupportedSize -DiskNumber 4 -PartitionNumber 2)\n",
						"Resize-Partition -DiskNumber 4 -PartitionNumber 2 -Size $size.SizeMax\n",
						"$size = (Get-PartitionSupportedSize -DiskNumber 5 -PartitionNumber 2)\n",
						"Resize-Partition -DiskNumber 5 -PartitionNumber 2 -Size $size.SizeMax\n",
						"Rename-Computer -NewName ms238cpodsql226 -Restart\n",
						"</powershell>"
					]]}
				}
			}
		},
		"ms238cpodsql227": {
			"Type": "AWS::EC2::Instance",
			"Properties": {
				"AvailabilityZone": "us-east-1d",
				"IamInstanceProfile": "Sysco-ApplicationDefaultInstanceProfile-47RRMF15XFMP",
				"ImageId": "ami-1a659560",
				"InstanceType": "t2.large",
				"KeyName": { "Ref": "PemKey2" },
				"SecurityGroupIds": [{ "Ref": "CPDBSG" }, { "Ref": "NATCLIENT" }, "sg-42dc8b26"],
				"SubnetId": { "Ref": "Conf1d" },
				"BlockDeviceMappings": [
					{"DeviceName": "/dev/sda1", "Ebs": { "VolumeSize": "50", "VolumeType": "gp2" }},
					{"DeviceName": "xvdb", "Ebs": { "VolumeSize": "1", "VolumeType": "gp2" }},
					{"DeviceName": "xvdc", "Ebs": { "VolumeSize": "1", "VolumeType": "gp2" }},
					{"DeviceName": "xvdd", "Ebs": { "VolumeSize": "1", "VolumeType": "gp2" }},
					{"DeviceName": "xvde", "Ebs": { "VolumeSize": "100", "VolumeType": "gp2" }},
					{"DeviceName": "xvdf", "Ebs": { "VolumeSize": "100", "VolumeType": "gp2" }}
				],
				"Tags": [
				  { "Key" : "Name", "Value": "ms238cpodsql227" },
				  { "Key" : "Application_Id", "Value" : { "Ref": "ApplicationId" } },
				  { "Key" : "Application_Name", "Value" : { "Ref": "ApplicationName" } },
				  { "Key" : "Environment", "Value" :  { "Ref": "Environment" } },
				  { "Key" : "PO_Number", "Value" : { "Ref": "PONumber" } },
				  { "Key" : "Project_ID", "Value" : { "Ref": "ProjectId" } },
				  { "Key" : "Owner", "Value" : { "Ref": "Owner" } },
				  { "Key" : "Approver", "Value" : { "Ref": "Approver" } }
				],
				"UserData": {
					"Fn::Base64": { "Fn::Join": [ "", [
						"<powershell>\n",
						"$size = (Get-PartitionSupportedSize -DiskNumber 4 -PartitionNumber 2)\n",
						"Resize-Partition -DiskNumber 4 -PartitionNumber 2 -Size $size.SizeMax\n",
						"$size = (Get-PartitionSupportedSize -DiskNumber 5 -PartitionNumber 2)\n",
						"Resize-Partition -DiskNumber 5 -PartitionNumber 2 -Size $size.SizeMax\n",
						"Rename-Computer -NewName ms238cpodsql227 -Restart\n",
						"</powershell>"
					]]}
				}
			}
		},
		"ms238cpodsql228": {
			"Type": "AWS::EC2::Instance",
			"Properties": {
				"AvailabilityZone": "us-east-1c",
				"IamInstanceProfile": "Sysco-ApplicationDefaultInstanceProfile-47RRMF15XFMP",
				"ImageId": "ami-1a659560",
				"InstanceType": "t2.large",
				"KeyName": { "Ref": "PemKey2" },
				"SecurityGroupIds": [{ "Ref": "CPDBSG" }, { "Ref": "NATCLIENT" }, "sg-42dc8b26"],
				"SubnetId": { "Ref": "Conf1c" },
				"BlockDeviceMappings": [
					{"DeviceName": "/dev/sda1", "Ebs": { "VolumeSize": "50", "VolumeType": "gp2" }},
					{"DeviceName": "xvdb", "Ebs": { "VolumeSize": "1", "VolumeType": "gp2" }},
					{"DeviceName": "xvdc", "Ebs": { "VolumeSize": "1", "VolumeType": "gp2" }},
					{"DeviceName": "xvdd", "Ebs": { "VolumeSize": "1", "VolumeType": "gp2" }},
					{"DeviceName": "xvde", "Ebs": { "VolumeSize": "100", "VolumeType": "gp2" }},
					{"DeviceName": "xvdf", "Ebs": { "VolumeSize": "100", "VolumeType": "gp2" }}
				],
				"Tags": [
				  { "Key" : "Name", "Value": "ms238cpodsql228" },
				  { "Key" : "Application_Id", "Value" : { "Ref": "ApplicationId" } },
				  { "Key" : "Application_Name", "Value" : { "Ref": "ApplicationName" } },
				  { "Key" : "Environment", "Value" :  { "Ref": "Environment" } },
				  { "Key" : "PO_Number", "Value" : { "Ref": "PONumber" } },
				  { "Key" : "Project_ID", "Value" : { "Ref": "ProjectId" } },
				  { "Key" : "Owner", "Value" : { "Ref": "Owner" } },
				  { "Key" : "Approver", "Value" : { "Ref": "Approver" } }
				],
				"UserData": {
					"Fn::Base64": { "Fn::Join": [ "", [
						"<powershell>\n",
						"$size = (Get-PartitionSupportedSize -DiskNumber 4 -PartitionNumber 2)\n",
						"Resize-Partition -DiskNumber 4 -PartitionNumber 2 -Size $size.SizeMax\n",
						"$size = (Get-PartitionSupportedSize -DiskNumber 5 -PartitionNumber 2)\n",
						"Resize-Partition -DiskNumber 5 -PartitionNumber 2 -Size $size.SizeMax\n",
						"Rename-Computer -NewName ms238cpodsql228 -Restart\n",
						"</powershell>"
					]]}
				}
			}
		},
		"ms238cpodsql229": {
			"Type": "AWS::EC2::Instance",
			"Properties": {
				"AvailabilityZone": "us-east-1d",
				"IamInstanceProfile": "Sysco-ApplicationDefaultInstanceProfile-47RRMF15XFMP",
				"ImageId": "ami-1a659560",
				"InstanceType": "t2.large",
				"KeyName": { "Ref": "PemKey2" },
				"SecurityGroupIds": [{ "Ref": "CPDBSG" }, { "Ref": "NATCLIENT" }, "sg-42dc8b26"],
				"SubnetId": { "Ref": "Conf1d" },
				"BlockDeviceMappings": [
					{"DeviceName": "/dev/sda1", "Ebs": { "VolumeSize": "50", "VolumeType": "gp2" }},
					{"DeviceName": "xvdb", "Ebs": { "VolumeSize": "1", "VolumeType": "gp2" }},
					{"DeviceName": "xvdc", "Ebs": { "VolumeSize": "1", "VolumeType": "gp2" }},
					{"DeviceName": "xvdd", "Ebs": { "VolumeSize": "1", "VolumeType": "gp2" }},
					{"DeviceName": "xvde", "Ebs": { "VolumeSize": "100", "VolumeType": "gp2" }},
					{"DeviceName": "xvdf", "Ebs": { "VolumeSize": "100", "VolumeType": "gp2" }}
				],
				"Tags": [
				  { "Key" : "Name", "Value": "ms238cpodsql229" },
				  { "Key" : "Application_Id", "Value" : { "Ref": "ApplicationId" } },
				  { "Key" : "Application_Name", "Value" : { "Ref": "ApplicationName" } },
				  { "Key" : "Environment", "Value" :  { "Ref": "Environment" } },
				  { "Key" : "PO_Number", "Value" : { "Ref": "PONumber" } },
				  { "Key" : "Project_ID", "Value" : { "Ref": "ProjectId" } },
				  { "Key" : "Owner", "Value" : { "Ref": "Owner" } },
				  { "Key" : "Approver", "Value" : { "Ref": "Approver" } }
				],
				"UserData": {
					"Fn::Base64": { "Fn::Join": [ "", [
						"<powershell>\n",
						"$size = (Get-PartitionSupportedSize -DiskNumber 4 -PartitionNumber 2)\n",
						"Resize-Partition -DiskNumber 4 -PartitionNumber 2 -Size $size.SizeMax\n",
						"$size = (Get-PartitionSupportedSize -DiskNumber 5 -PartitionNumber 2)\n",
						"Resize-Partition -DiskNumber 5 -PartitionNumber 2 -Size $size.SizeMax\n",
						"Rename-Computer -NewName ms238cpodsql229 -Restart\n",
						"</powershell>"
					]]}
				}
			}
		},
		"ms238cpodsql230": {
			"Type": "AWS::EC2::Instance",
			"Properties": {
				"AvailabilityZone": "us-east-1c",
				"IamInstanceProfile": "Sysco-ApplicationDefaultInstanceProfile-47RRMF15XFMP",
				"ImageId": "ami-1a659560",
				"InstanceType": "t2.large",
				"KeyName": { "Ref": "PemKey2" },
				"SecurityGroupIds": [{ "Ref": "CPDBSG" }, { "Ref": "NATCLIENT" }, "sg-42dc8b26"],
				"SubnetId": { "Ref": "Conf1c" },
				"BlockDeviceMappings": [
					{"DeviceName": "/dev/sda1", "Ebs": { "VolumeSize": "50", "VolumeType": "gp2" }},
					{"DeviceName": "xvdb", "Ebs": { "VolumeSize": "1", "VolumeType": "gp2" }},
					{"DeviceName": "xvdc", "Ebs": { "VolumeSize": "1", "VolumeType": "gp2" }},
					{"DeviceName": "xvdd", "Ebs": { "VolumeSize": "1", "VolumeType": "gp2" }},
					{"DeviceName": "xvde", "Ebs": { "VolumeSize": "100", "VolumeType": "gp2" }},
					{"DeviceName": "xvdf", "Ebs": { "VolumeSize": "100", "VolumeType": "gp2" }}
				],
				"Tags": [
				  { "Key" : "Name", "Value": "ms238cpodsql230" },
				  { "Key" : "Application_Id", "Value" : { "Ref": "ApplicationId" } },
				  { "Key" : "Application_Name", "Value" : { "Ref": "ApplicationName" } },
				  { "Key" : "Environment", "Value" :  { "Ref": "Environment" } },
				  { "Key" : "PO_Number", "Value" : { "Ref": "PONumber" } },
				  { "Key" : "Project_ID", "Value" : { "Ref": "ProjectId" } },
				  { "Key" : "Owner", "Value" : { "Ref": "Owner" } },
				  { "Key" : "Approver", "Value" : { "Ref": "Approver" } }
				],
				"UserData": {
					"Fn::Base64": { "Fn::Join": [ "", [
						"<powershell>\n",
						"$size = (Get-PartitionSupportedSize -DiskNumber 4 -PartitionNumber 2)\n",
						"Resize-Partition -DiskNumber 4 -PartitionNumber 2 -Size $size.SizeMax\n",
						"$size = (Get-PartitionSupportedSize -DiskNumber 5 -PartitionNumber 2)\n",
						"Resize-Partition -DiskNumber 5 -PartitionNumber 2 -Size $size.SizeMax\n",
						"Rename-Computer -NewName ms238cpodsql230 -Restart\n",
						"</powershell>"
					]]}
				}
			}
		},
		"ms238cpodsql231": {
			"Type": "AWS::EC2::Instance",
			"Properties": {
				"AvailabilityZone": "us-east-1d",
				"IamInstanceProfile": "Sysco-ApplicationDefaultInstanceProfile-47RRMF15XFMP",
				"ImageId": "ami-1a659560",
				"InstanceType": "t2.large",
				"KeyName": { "Ref": "PemKey2" },
				"SecurityGroupIds": [{ "Ref": "CPDBSG" }, { "Ref": "NATCLIENT" }, "sg-42dc8b26"],
				"SubnetId": { "Ref": "Conf1d" },
				"BlockDeviceMappings": [
					{"DeviceName": "/dev/sda1", "Ebs": { "VolumeSize": "50", "VolumeType": "gp2" }},
					{"DeviceName": "xvdb", "Ebs": { "VolumeSize": "1", "VolumeType": "gp2" }},
					{"DeviceName": "xvdc", "Ebs": { "VolumeSize": "1", "VolumeType": "gp2" }},
					{"DeviceName": "xvdd", "Ebs": { "VolumeSize": "1", "VolumeType": "gp2" }},
					{"DeviceName": "xvde", "Ebs": { "VolumeSize": "100", "VolumeType": "gp2" }},
					{"DeviceName": "xvdf", "Ebs": { "VolumeSize": "100", "VolumeType": "gp2" }}
				],
				"Tags": [
				  { "Key" : "Name", "Value": "ms238cpodsql231" },
				  { "Key" : "Application_Id", "Value" : { "Ref": "ApplicationId" } },
				  { "Key" : "Application_Name", "Value" : { "Ref": "ApplicationName" } },
				  { "Key" : "Environment", "Value" :  { "Ref": "Environment" } },
				  { "Key" : "PO_Number", "Value" : { "Ref": "PONumber" } },
				  { "Key" : "Project_ID", "Value" : { "Ref": "ProjectId" } },
				  { "Key" : "Owner", "Value" : { "Ref": "Owner" } },
				  { "Key" : "Approver", "Value" : { "Ref": "Approver" } }
				],
				"UserData": {
					"Fn::Base64": { "Fn::Join": [ "", [
						"<powershell>\n",
						"$size = (Get-PartitionSupportedSize -DiskNumber 4 -PartitionNumber 2)\n",
						"Resize-Partition -DiskNumber 4 -PartitionNumber 2 -Size $size.SizeMax\n",
						"$size = (Get-PartitionSupportedSize -DiskNumber 5 -PartitionNumber 2)\n",
						"Resize-Partition -DiskNumber 5 -PartitionNumber 2 -Size $size.SizeMax\n",
						"Rename-Computer -NewName ms238cpodsql231 -Restart\n",
						"</powershell>"
					]]}
				}
			}
		},
		"ms238cpodsql232": {
			"Type": "AWS::EC2::Instance",
			"Properties": {
				"AvailabilityZone": "us-east-1c",
				"IamInstanceProfile": "Sysco-ApplicationDefaultInstanceProfile-47RRMF15XFMP",
				"ImageId": "ami-1a659560",
				"InstanceType": "t2.large",
				"KeyName": { "Ref": "PemKey2" },
				"SecurityGroupIds": [{ "Ref": "CPDBSG" }, { "Ref": "NATCLIENT" }, "sg-42dc8b26"],
				"SubnetId": { "Ref": "Conf1c" },
				"BlockDeviceMappings": [
					{"DeviceName": "/dev/sda1", "Ebs": { "VolumeSize": "50", "VolumeType": "gp2" }},
					{"DeviceName": "xvdb", "Ebs": { "VolumeSize": "1", "VolumeType": "gp2" }},
					{"DeviceName": "xvdc", "Ebs": { "VolumeSize": "1", "VolumeType": "gp2" }},
					{"DeviceName": "xvdd", "Ebs": { "VolumeSize": "1", "VolumeType": "gp2" }},
					{"DeviceName": "xvde", "Ebs": { "VolumeSize": "100", "VolumeType": "gp2" }},
					{"DeviceName": "xvdf", "Ebs": { "VolumeSize": "100", "VolumeType": "gp2" }}
				],
				"Tags": [
				  { "Key" : "Name", "Value": "ms238cpodsql232" },
				  { "Key" : "Application_Id", "Value" : { "Ref": "ApplicationId" } },
				  { "Key" : "Application_Name", "Value" : { "Ref": "ApplicationName" } },
				  { "Key" : "Environment", "Value" :  { "Ref": "Environment" } },
				  { "Key" : "PO_Number", "Value" : { "Ref": "PONumber" } },
				  { "Key" : "Project_ID", "Value" : { "Ref": "ProjectId" } },
				  { "Key" : "Owner", "Value" : { "Ref": "Owner" } },
				  { "Key" : "Approver", "Value" : { "Ref": "Approver" } }
				],
				"UserData": {
					"Fn::Base64": { "Fn::Join": [ "", [
						"<powershell>\n",
						"$size = (Get-PartitionSupportedSize -DiskNumber 4 -PartitionNumber 2)\n",
						"Resize-Partition -DiskNumber 4 -PartitionNumber 2 -Size $size.SizeMax\n",
						"$size = (Get-PartitionSupportedSize -DiskNumber 5 -PartitionNumber 2)\n",
						"Resize-Partition -DiskNumber 5 -PartitionNumber 2 -Size $size.SizeMax\n",
						"Rename-Computer -NewName ms238cpodsql232 -Restart\n",
						"</powershell>"
					]]}
				}
			}
		},
		"ms238cpodsql233": {
			"Type": "AWS::EC2::Instance",
			"Properties": {
				"AvailabilityZone": "us-east-1d",
				"IamInstanceProfile": "Sysco-ApplicationDefaultInstanceProfile-47RRMF15XFMP",
				"ImageId": "ami-1a659560",
				"InstanceType": "t2.large",
				"KeyName": { "Ref": "PemKey2" },
				"SecurityGroupIds": [{ "Ref": "CPDBSG" }, { "Ref": "NATCLIENT" }, "sg-42dc8b26"],
				"SubnetId": { "Ref": "Conf1d" },
				"BlockDeviceMappings": [
					{"DeviceName": "/dev/sda1", "Ebs": { "VolumeSize": "50", "VolumeType": "gp2" }},
					{"DeviceName": "xvdb", "Ebs": { "VolumeSize": "1", "VolumeType": "gp2" }},
					{"DeviceName": "xvdc", "Ebs": { "VolumeSize": "1", "VolumeType": "gp2" }},
					{"DeviceName": "xvdd", "Ebs": { "VolumeSize": "1", "VolumeType": "gp2" }},
					{"DeviceName": "xvde", "Ebs": { "VolumeSize": "100", "VolumeType": "gp2" }},
					{"DeviceName": "xvdf", "Ebs": { "VolumeSize": "100", "VolumeType": "gp2" }}
				],
				"Tags": [
				  { "Key" : "Name", "Value": "ms238cpodsql233" },
				  { "Key" : "Application_Id", "Value" : { "Ref": "ApplicationId" } },
				  { "Key" : "Application_Name", "Value" : { "Ref": "ApplicationName" } },
				  { "Key" : "Environment", "Value" :  { "Ref": "Environment" } },
				  { "Key" : "PO_Number", "Value" : { "Ref": "PONumber" } },
				  { "Key" : "Project_ID", "Value" : { "Ref": "ProjectId" } },
				  { "Key" : "Owner", "Value" : { "Ref": "Owner" } },
				  { "Key" : "Approver", "Value" : { "Ref": "Approver" } }
				],
				"UserData": {
					"Fn::Base64": { "Fn::Join": [ "", [
						"<powershell>\n",
						"$size = (Get-PartitionSupportedSize -DiskNumber 4 -PartitionNumber 2)\n",
						"Resize-Partition -DiskNumber 4 -PartitionNumber 2 -Size $size.SizeMax\n",
						"$size = (Get-PartitionSupportedSize -DiskNumber 5 -PartitionNumber 2)\n",
						"Resize-Partition -DiskNumber 5 -PartitionNumber 2 -Size $size.SizeMax\n",
						"Rename-Computer -NewName ms238cpodsql233 -Restart\n",
						"</powershell>"
					]]}
				}
			}
		},
		"ms238cpodsql234": {
			"Type": "AWS::EC2::Instance",
			"Properties": {
				"AvailabilityZone": "us-east-1c",
				"IamInstanceProfile": "Sysco-ApplicationDefaultInstanceProfile-47RRMF15XFMP",
				"ImageId": "ami-1a659560",
				"InstanceType": "t2.large",
				"KeyName": { "Ref": "PemKey2" },
				"SecurityGroupIds": [{ "Ref": "CPDBSG" }, { "Ref": "NATCLIENT" }, "sg-42dc8b26"],
				"SubnetId": { "Ref": "Conf1c" },
				"BlockDeviceMappings": [
					{"DeviceName": "/dev/sda1", "Ebs": { "VolumeSize": "50", "VolumeType": "gp2" }},
					{"DeviceName": "xvdb", "Ebs": { "VolumeSize": "1", "VolumeType": "gp2" }},
					{"DeviceName": "xvdc", "Ebs": { "VolumeSize": "1", "VolumeType": "gp2" }},
					{"DeviceName": "xvdd", "Ebs": { "VolumeSize": "1", "VolumeType": "gp2" }},
					{"DeviceName": "xvde", "Ebs": { "VolumeSize": "100", "VolumeType": "gp2" }},
					{"DeviceName": "xvdf", "Ebs": { "VolumeSize": "100", "VolumeType": "gp2" }}
				],
				"Tags": [
				  { "Key" : "Name", "Value": "ms238cpodsql234" },
				  { "Key" : "Application_Id", "Value" : { "Ref": "ApplicationId" } },
				  { "Key" : "Application_Name", "Value" : { "Ref": "ApplicationName" } },
				  { "Key" : "Environment", "Value" :  { "Ref": "Environment" } },
				  { "Key" : "PO_Number", "Value" : { "Ref": "PONumber" } },
				  { "Key" : "Project_ID", "Value" : { "Ref": "ProjectId" } },
				  { "Key" : "Owner", "Value" : { "Ref": "Owner" } },
				  { "Key" : "Approver", "Value" : { "Ref": "Approver" } }
				],
				"UserData": {
					"Fn::Base64": { "Fn::Join": [ "", [
						"<powershell>\n",
						"$size = (Get-PartitionSupportedSize -DiskNumber 4 -PartitionNumber 2)\n",
						"Resize-Partition -DiskNumber 4 -PartitionNumber 2 -Size $size.SizeMax\n",
						"$size = (Get-PartitionSupportedSize -DiskNumber 5 -PartitionNumber 2)\n",
						"Resize-Partition -DiskNumber 5 -PartitionNumber 2 -Size $size.SizeMax\n",
						"Rename-Computer -NewName ms238cpodsql234 -Restart\n",
						"</powershell>"
					]]}
				}
			}
		},
		"ms238cpodsql235": {
			"Type": "AWS::EC2::Instance",
			"Properties": {
				"AvailabilityZone": "us-east-1d",
				"IamInstanceProfile": "Sysco-ApplicationDefaultInstanceProfile-47RRMF15XFMP",
				"ImageId": "ami-1a659560",
				"InstanceType": "t2.large",
				"KeyName": { "Ref": "PemKey2" },
				"SecurityGroupIds": [{ "Ref": "CPDBSG" }, { "Ref": "NATCLIENT" }, "sg-42dc8b26"],
				"SubnetId": { "Ref": "Conf1d" },
				"BlockDeviceMappings": [
					{"DeviceName": "/dev/sda1", "Ebs": { "VolumeSize": "50", "VolumeType": "gp2" }},
					{"DeviceName": "xvdb", "Ebs": { "VolumeSize": "1", "VolumeType": "gp2" }},
					{"DeviceName": "xvdc", "Ebs": { "VolumeSize": "1", "VolumeType": "gp2" }},
					{"DeviceName": "xvdd", "Ebs": { "VolumeSize": "1", "VolumeType": "gp2" }},
					{"DeviceName": "xvde", "Ebs": { "VolumeSize": "100", "VolumeType": "gp2" }},
					{"DeviceName": "xvdf", "Ebs": { "VolumeSize": "100", "VolumeType": "gp2" }}
				],
				"Tags": [
				  { "Key" : "Name", "Value": "ms238cpodsql235" },
				  { "Key" : "Application_Id", "Value" : { "Ref": "ApplicationId" } },
				  { "Key" : "Application_Name", "Value" : { "Ref": "ApplicationName" } },
				  { "Key" : "Environment", "Value" :  { "Ref": "Environment" } },
				  { "Key" : "PO_Number", "Value" : { "Ref": "PONumber" } },
				  { "Key" : "Project_ID", "Value" : { "Ref": "ProjectId" } },
				  { "Key" : "Owner", "Value" : { "Ref": "Owner" } },
				  { "Key" : "Approver", "Value" : { "Ref": "Approver" } }
				],
				"UserData": {
					"Fn::Base64": { "Fn::Join": [ "", [
						"<powershell>\n",
						"$size = (Get-PartitionSupportedSize -DiskNumber 4 -PartitionNumber 2)\n",
						"Resize-Partition -DiskNumber 4 -PartitionNumber 2 -Size $size.SizeMax\n",
						"$size = (Get-PartitionSupportedSize -DiskNumber 5 -PartitionNumber 2)\n",
						"Resize-Partition -DiskNumber 5 -PartitionNumber 2 -Size $size.SizeMax\n",
						"Rename-Computer -NewName ms238cpodsql235 -Restart\n",
						"</powershell>"
					]]}
				}
			}
		},
		"ms238cpodsql236": {
			"Type": "AWS::EC2::Instance",
			"Properties": {
				"AvailabilityZone": "us-east-1c",
				"IamInstanceProfile": "Sysco-ApplicationDefaultInstanceProfile-47RRMF15XFMP",
				"ImageId": "ami-1a659560",
				"InstanceType": "t2.large",
				"KeyName": { "Ref": "PemKey2" },
				"SecurityGroupIds": [{ "Ref": "CPDBSG" }, { "Ref": "NATCLIENT" }, "sg-42dc8b26"],
				"SubnetId": { "Ref": "Conf1c" },
				"BlockDeviceMappings": [
					{"DeviceName": "/dev/sda1", "Ebs": { "VolumeSize": "50", "VolumeType": "gp2" }},
					{"DeviceName": "xvdb", "Ebs": { "VolumeSize": "1", "VolumeType": "gp2" }},
					{"DeviceName": "xvdc", "Ebs": { "VolumeSize": "1", "VolumeType": "gp2" }},
					{"DeviceName": "xvdd", "Ebs": { "VolumeSize": "1", "VolumeType": "gp2" }},
					{"DeviceName": "xvde", "Ebs": { "VolumeSize": "100", "VolumeType": "gp2" }},
					{"DeviceName": "xvdf", "Ebs": { "VolumeSize": "100", "VolumeType": "gp2" }}
				],
				"Tags": [
				  { "Key" : "Name", "Value": "ms238cpodsql236" },
				  { "Key" : "Application_Id", "Value" : { "Ref": "ApplicationId" } },
				  { "Key" : "Application_Name", "Value" : { "Ref": "ApplicationName" } },
				  { "Key" : "Environment", "Value" :  { "Ref": "Environment" } },
				  { "Key" : "PO_Number", "Value" : { "Ref": "PONumber" } },
				  { "Key" : "Project_ID", "Value" : { "Ref": "ProjectId" } },
				  { "Key" : "Owner", "Value" : { "Ref": "Owner" } },
				  { "Key" : "Approver", "Value" : { "Ref": "Approver" } }
				],
				"UserData": {
					"Fn::Base64": { "Fn::Join": [ "", [
						"<powershell>\n",
						"$size = (Get-PartitionSupportedSize -DiskNumber 4 -PartitionNumber 2)\n",
						"Resize-Partition -DiskNumber 4 -PartitionNumber 2 -Size $size.SizeMax\n",
						"$size = (Get-PartitionSupportedSize -DiskNumber 5 -PartitionNumber 2)\n",
						"Resize-Partition -DiskNumber 5 -PartitionNumber 2 -Size $size.SizeMax\n",
						"Rename-Computer -NewName ms238cpodsql236 -Restart\n",
						"</powershell>"
					]]}
				}
			}
		},
		"ms238cpodsql237": {
			"Type": "AWS::EC2::Instance",
			"Properties": {
				"AvailabilityZone": "us-east-1d",
				"IamInstanceProfile": "Sysco-ApplicationDefaultInstanceProfile-47RRMF15XFMP",
				"ImageId": "ami-1a659560",
				"InstanceType": "t2.large",
				"KeyName": { "Ref": "PemKey2" },
				"SecurityGroupIds": [{ "Ref": "CPDBSG" }, { "Ref": "NATCLIENT" }, "sg-42dc8b26"],
				"SubnetId": { "Ref": "Conf1d" },
				"BlockDeviceMappings": [
					{"DeviceName": "/dev/sda1", "Ebs": { "VolumeSize": "50", "VolumeType": "gp2" }},
					{"DeviceName": "xvdb", "Ebs": { "VolumeSize": "1", "VolumeType": "gp2" }},
					{"DeviceName": "xvdc", "Ebs": { "VolumeSize": "1", "VolumeType": "gp2" }},
					{"DeviceName": "xvdd", "Ebs": { "VolumeSize": "1", "VolumeType": "gp2" }},
					{"DeviceName": "xvde", "Ebs": { "VolumeSize": "100", "VolumeType": "gp2" }},
					{"DeviceName": "xvdf", "Ebs": { "VolumeSize": "100", "VolumeType": "gp2" }}
				],
				"Tags": [
				  { "Key" : "Name", "Value": "ms238cpodsql237" },
				  { "Key" : "Application_Id", "Value" : { "Ref": "ApplicationId" } },
				  { "Key" : "Application_Name", "Value" : { "Ref": "ApplicationName" } },
				  { "Key" : "Environment", "Value" :  { "Ref": "Environment" } },
				  { "Key" : "PO_Number", "Value" : { "Ref": "PONumber" } },
				  { "Key" : "Project_ID", "Value" : { "Ref": "ProjectId" } },
				  { "Key" : "Owner", "Value" : { "Ref": "Owner" } },
				  { "Key" : "Approver", "Value" : { "Ref": "Approver" } }
				],
				"UserData": {
					"Fn::Base64": { "Fn::Join": [ "", [
						"<powershell>\n",
						"$size = (Get-PartitionSupportedSize -DiskNumber 4 -PartitionNumber 2)\n",
						"Resize-Partition -DiskNumber 4 -PartitionNumber 2 -Size $size.SizeMax\n",
						"$size = (Get-PartitionSupportedSize -DiskNumber 5 -PartitionNumber 2)\n",
						"Resize-Partition -DiskNumber 5 -PartitionNumber 2 -Size $size.SizeMax\n",
						"Rename-Computer -NewName ms238cpodsql237 -Restart\n",
						"</powershell>"
					]]}
				}
			}
		},
		"ms238cpodsql238": {
			"Type": "AWS::EC2::Instance",
			"Properties": {
				"AvailabilityZone": "us-east-1c",
				"IamInstanceProfile": "Sysco-ApplicationDefaultInstanceProfile-47RRMF15XFMP",
				"ImageId": "ami-1a659560",
				"InstanceType": "t2.large",
				"KeyName": { "Ref": "PemKey2" },
				"SecurityGroupIds": [{ "Ref": "CPDBSG" }, { "Ref": "NATCLIENT" }, "sg-42dc8b26"],
				"SubnetId": { "Ref": "Conf1c" },
				"BlockDeviceMappings": [
					{"DeviceName": "/dev/sda1", "Ebs": { "VolumeSize": "50", "VolumeType": "gp2" }},
					{"DeviceName": "xvdb", "Ebs": { "VolumeSize": "1", "VolumeType": "gp2" }},
					{"DeviceName": "xvdc", "Ebs": { "VolumeSize": "1", "VolumeType": "gp2" }},
					{"DeviceName": "xvdd", "Ebs": { "VolumeSize": "1", "VolumeType": "gp2" }},
					{"DeviceName": "xvde", "Ebs": { "VolumeSize": "100", "VolumeType": "gp2" }},
					{"DeviceName": "xvdf", "Ebs": { "VolumeSize": "100", "VolumeType": "gp2" }}
				],
				"Tags": [
				  { "Key" : "Name", "Value": "ms238cpodsql238" },
				  { "Key" : "Application_Id", "Value" : { "Ref": "ApplicationId" } },
				  { "Key" : "Application_Name", "Value" : { "Ref": "ApplicationName" } },
				  { "Key" : "Environment", "Value" :  { "Ref": "Environment" } },
				  { "Key" : "PO_Number", "Value" : { "Ref": "PONumber" } },
				  { "Key" : "Project_ID", "Value" : { "Ref": "ProjectId" } },
				  { "Key" : "Owner", "Value" : { "Ref": "Owner" } },
				  { "Key" : "Approver", "Value" : { "Ref": "Approver" } }
				],
				"UserData": {
					"Fn::Base64": { "Fn::Join": [ "", [
						"<powershell>\n",
						"$size = (Get-PartitionSupportedSize -DiskNumber 4 -PartitionNumber 2)\n",
						"Resize-Partition -DiskNumber 4 -PartitionNumber 2 -Size $size.SizeMax\n",
						"$size = (Get-PartitionSupportedSize -DiskNumber 5 -PartitionNumber 2)\n",
						"Resize-Partition -DiskNumber 5 -PartitionNumber 2 -Size $size.SizeMax\n",
						"Rename-Computer -NewName ms238cpodsql238 -Restart\n",
						"</powershell>"
					]]}
				}
			}
		},
		"ms238cpodsql239": {
			"Type": "AWS::EC2::Instance",
			"Properties": {
				"AvailabilityZone": "us-east-1d",
				"IamInstanceProfile": "Sysco-ApplicationDefaultInstanceProfile-47RRMF15XFMP",
				"ImageId": "ami-1a659560",
				"InstanceType": "t2.large",
				"KeyName": { "Ref": "PemKey2" },
				"SecurityGroupIds": [{ "Ref": "CPDBSG" }, { "Ref": "NATCLIENT" }, "sg-42dc8b26"],
				"SubnetId": { "Ref": "Conf1d" },
				"BlockDeviceMappings": [
					{"DeviceName": "/dev/sda1", "Ebs": { "VolumeSize": "50", "VolumeType": "gp2" }},
					{"DeviceName": "xvdb", "Ebs": { "VolumeSize": "1", "VolumeType": "gp2" }},
					{"DeviceName": "xvdc", "Ebs": { "VolumeSize": "1", "VolumeType": "gp2" }},
					{"DeviceName": "xvdd", "Ebs": { "VolumeSize": "1", "VolumeType": "gp2" }},
					{"DeviceName": "xvde", "Ebs": { "VolumeSize": "100", "VolumeType": "gp2" }},
					{"DeviceName": "xvdf", "Ebs": { "VolumeSize": "100", "VolumeType": "gp2" }}
				],
				"Tags": [
				  { "Key" : "Name", "Value": "ms238cpodsql239" },
				  { "Key" : "Application_Id", "Value" : { "Ref": "ApplicationId" } },
				  { "Key" : "Application_Name", "Value" : { "Ref": "ApplicationName" } },
				  { "Key" : "Environment", "Value" :  { "Ref": "Environment" } },
				  { "Key" : "PO_Number", "Value" : { "Ref": "PONumber" } },
				  { "Key" : "Project_ID", "Value" : { "Ref": "ProjectId" } },
				  { "Key" : "Owner", "Value" : { "Ref": "Owner" } },
				  { "Key" : "Approver", "Value" : { "Ref": "Approver" } }
				],
				"UserData": {
					"Fn::Base64": { "Fn::Join": [ "", [
						"<powershell>\n",
						"$size = (Get-PartitionSupportedSize -DiskNumber 4 -PartitionNumber 2)\n",
						"Resize-Partition -DiskNumber 4 -PartitionNumber 2 -Size $size.SizeMax\n",
						"$size = (Get-PartitionSupportedSize -DiskNumber 5 -PartitionNumber 2)\n",
						"Resize-Partition -DiskNumber 5 -PartitionNumber 2 -Size $size.SizeMax\n",
						"Rename-Computer -NewName ms238cpodsql239 -Restart\n",
						"</powershell>"
					]]}
				}
			}
		},
		"ms238cpodsql240": {
			"Type": "AWS::EC2::Instance",
			"Properties": {
				"AvailabilityZone": "us-east-1c",
				"IamInstanceProfile": "Sysco-ApplicationDefaultInstanceProfile-47RRMF15XFMP",
				"ImageId": "ami-1a659560",
				"InstanceType": "t2.large",
				"KeyName": { "Ref": "PemKey2" },
				"SecurityGroupIds": [{ "Ref": "CPDBSG" }, { "Ref": "NATCLIENT" }, "sg-42dc8b26"],
				"SubnetId": { "Ref": "Conf1c" },
				"BlockDeviceMappings": [
					{"DeviceName": "/dev/sda1", "Ebs": { "VolumeSize": "50", "VolumeType": "gp2" }},
					{"DeviceName": "xvdb", "Ebs": { "VolumeSize": "1", "VolumeType": "gp2" }},
					{"DeviceName": "xvdc", "Ebs": { "VolumeSize": "1", "VolumeType": "gp2" }},
					{"DeviceName": "xvdd", "Ebs": { "VolumeSize": "1", "VolumeType": "gp2" }},
					{"DeviceName": "xvde", "Ebs": { "VolumeSize": "100", "VolumeType": "gp2" }},
					{"DeviceName": "xvdf", "Ebs": { "VolumeSize": "100", "VolumeType": "gp2" }}
				],
				"Tags": [
				  { "Key" : "Name", "Value": "ms238cpodsql240" },
				  { "Key" : "Application_Id", "Value" : { "Ref": "ApplicationId" } },
				  { "Key" : "Application_Name", "Value" : { "Ref": "ApplicationName" } },
				  { "Key" : "Environment", "Value" :  { "Ref": "Environment" } },
				  { "Key" : "PO_Number", "Value" : { "Ref": "PONumber" } },
				  { "Key" : "Project_ID", "Value" : { "Ref": "ProjectId" } },
				  { "Key" : "Owner", "Value" : { "Ref": "Owner" } },
				  { "Key" : "Approver", "Value" : { "Ref": "Approver" } }
				],
				"UserData": {
					"Fn::Base64": { "Fn::Join": [ "", [
						"<powershell>\n",
						"$size = (Get-PartitionSupportedSize -DiskNumber 4 -PartitionNumber 2)\n",
						"Resize-Partition -DiskNumber 4 -PartitionNumber 2 -Size $size.SizeMax\n",
						"$size = (Get-PartitionSupportedSize -DiskNumber 5 -PartitionNumber 2)\n",
						"Resize-Partition -DiskNumber 5 -PartitionNumber 2 -Size $size.SizeMax\n",
						"Rename-Computer -NewName ms238cpodsql240 -Restart\n",
						"</powershell>"
					]]}
				}
			}
		},
		"ms238cpodsql241": {
			"Type": "AWS::EC2::Instance",
			"Properties": {
				"AvailabilityZone": "us-east-1d",
				"IamInstanceProfile": "Sysco-ApplicationDefaultInstanceProfile-47RRMF15XFMP",
				"ImageId": "ami-1a659560",
				"InstanceType": "t2.large",
				"KeyName": { "Ref": "PemKey2" },
				"SecurityGroupIds": [{ "Ref": "CPDBSG" }, { "Ref": "NATCLIENT" }, "sg-42dc8b26"],
				"SubnetId": { "Ref": "Conf1d" },
				"BlockDeviceMappings": [
					{"DeviceName": "/dev/sda1", "Ebs": { "VolumeSize": "50", "VolumeType": "gp2" }},
					{"DeviceName": "xvdb", "Ebs": { "VolumeSize": "1", "VolumeType": "gp2" }},
					{"DeviceName": "xvdc", "Ebs": { "VolumeSize": "1", "VolumeType": "gp2" }},
					{"DeviceName": "xvdd", "Ebs": { "VolumeSize": "1", "VolumeType": "gp2" }},
					{"DeviceName": "xvde", "Ebs": { "VolumeSize": "100", "VolumeType": "gp2" }},
					{"DeviceName": "xvdf", "Ebs": { "VolumeSize": "100", "VolumeType": "gp2" }}
				],
				"Tags": [
				  { "Key" : "Name", "Value": "ms238cpodsql241" },
				  { "Key" : "Application_Id", "Value" : { "Ref": "ApplicationId" } },
				  { "Key" : "Application_Name", "Value" : { "Ref": "ApplicationName" } },
				  { "Key" : "Environment", "Value" :  { "Ref": "Environment" } },
				  { "Key" : "PO_Number", "Value" : { "Ref": "PONumber" } },
				  { "Key" : "Project_ID", "Value" : { "Ref": "ProjectId" } },
				  { "Key" : "Owner", "Value" : { "Ref": "Owner" } },
				  { "Key" : "Approver", "Value" : { "Ref": "Approver" } }
				],
				"UserData": {
					"Fn::Base64": { "Fn::Join": [ "", [
						"<powershell>\n",
						"$size = (Get-PartitionSupportedSize -DiskNumber 4 -PartitionNumber 2)\n",
						"Resize-Partition -DiskNumber 4 -PartitionNumber 2 -Size $size.SizeMax\n",
						"$size = (Get-PartitionSupportedSize -DiskNumber 5 -PartitionNumber 2)\n",
						"Resize-Partition -DiskNumber 5 -PartitionNumber 2 -Size $size.SizeMax\n",
						"Rename-Computer -NewName ms238cpodsql241 -Restart\n",
						"</powershell>"
					]]}
				}
			}
		},
		"ms238cpodsql242": {
			"Type": "AWS::EC2::Instance",
			"Properties": {
				"AvailabilityZone": "us-east-1c",
				"IamInstanceProfile": "Sysco-ApplicationDefaultInstanceProfile-47RRMF15XFMP",
				"ImageId": "ami-1a659560",
				"InstanceType": "t2.large",
				"KeyName": { "Ref": "PemKey2" },
				"SecurityGroupIds": [{ "Ref": "CPDBSG" }, { "Ref": "NATCLIENT" }, "sg-42dc8b26"],
				"SubnetId": { "Ref": "Conf1c" },
				"BlockDeviceMappings": [
					{"DeviceName": "/dev/sda1", "Ebs": { "VolumeSize": "50", "VolumeType": "gp2" }},
					{"DeviceName": "xvdb", "Ebs": { "VolumeSize": "1", "VolumeType": "gp2" }},
					{"DeviceName": "xvdc", "Ebs": { "VolumeSize": "1", "VolumeType": "gp2" }},
					{"DeviceName": "xvdd", "Ebs": { "VolumeSize": "1", "VolumeType": "gp2" }},
					{"DeviceName": "xvde", "Ebs": { "VolumeSize": "100", "VolumeType": "gp2" }},
					{"DeviceName": "xvdf", "Ebs": { "VolumeSize": "100", "VolumeType": "gp2" }}
				],
				"Tags": [
				  { "Key" : "Name", "Value": "ms238cpodsql242" },
				  { "Key" : "Application_Id", "Value" : { "Ref": "ApplicationId" } },
				  { "Key" : "Application_Name", "Value" : { "Ref": "ApplicationName" } },
				  { "Key" : "Environment", "Value" :  { "Ref": "Environment" } },
				  { "Key" : "PO_Number", "Value" : { "Ref": "PONumber" } },
				  { "Key" : "Project_ID", "Value" : { "Ref": "ProjectId" } },
				  { "Key" : "Owner", "Value" : { "Ref": "Owner" } },
				  { "Key" : "Approver", "Value" : { "Ref": "Approver" } }
				],
				"UserData": {
					"Fn::Base64": { "Fn::Join": [ "", [
						"<powershell>\n",
						"$size = (Get-PartitionSupportedSize -DiskNumber 4 -PartitionNumber 2)\n",
						"Resize-Partition -DiskNumber 4 -PartitionNumber 2 -Size $size.SizeMax\n",
						"$size = (Get-PartitionSupportedSize -DiskNumber 5 -PartitionNumber 2)\n",
						"Resize-Partition -DiskNumber 5 -PartitionNumber 2 -Size $size.SizeMax\n",
						"Rename-Computer -NewName ms238cpodsql242 -Restart\n",
						"</powershell>"
					]]}
				}
			}
		},
		"ms238cpodsql243": {
			"Type": "AWS::EC2::Instance",
			"Properties": {
				"AvailabilityZone": "us-east-1d",
				"IamInstanceProfile": "Sysco-ApplicationDefaultInstanceProfile-47RRMF15XFMP",
				"ImageId": "ami-1a659560",
				"InstanceType": "t2.large",
				"KeyName": { "Ref": "PemKey2" },
				"SecurityGroupIds": [{ "Ref": "CPDBSG" }, { "Ref": "NATCLIENT" }, "sg-42dc8b26"],
				"SubnetId": { "Ref": "Conf1d" },
				"BlockDeviceMappings": [
					{"DeviceName": "/dev/sda1", "Ebs": { "VolumeSize": "50", "VolumeType": "gp2" }},
					{"DeviceName": "xvdb", "Ebs": { "VolumeSize": "1", "VolumeType": "gp2" }},
					{"DeviceName": "xvdc", "Ebs": { "VolumeSize": "1", "VolumeType": "gp2" }},
					{"DeviceName": "xvdd", "Ebs": { "VolumeSize": "1", "VolumeType": "gp2" }},
					{"DeviceName": "xvde", "Ebs": { "VolumeSize": "100", "VolumeType": "gp2" }},
					{"DeviceName": "xvdf", "Ebs": { "VolumeSize": "100", "VolumeType": "gp2" }}
				],
				"Tags": [
				  { "Key" : "Name", "Value": "ms238cpodsql243" },
				  { "Key" : "Application_Id", "Value" : { "Ref": "ApplicationId" } },
				  { "Key" : "Application_Name", "Value" : { "Ref": "ApplicationName" } },
				  { "Key" : "Environment", "Value" :  { "Ref": "Environment" } },
				  { "Key" : "PO_Number", "Value" : { "Ref": "PONumber" } },
				  { "Key" : "Project_ID", "Value" : { "Ref": "ProjectId" } },
				  { "Key" : "Owner", "Value" : { "Ref": "Owner" } },
				  { "Key" : "Approver", "Value" : { "Ref": "Approver" } }
				],
				"UserData": {
					"Fn::Base64": { "Fn::Join": [ "", [
						"<powershell>\n",
						"$size = (Get-PartitionSupportedSize -DiskNumber 4 -PartitionNumber 2)\n",
						"Resize-Partition -DiskNumber 4 -PartitionNumber 2 -Size $size.SizeMax\n",
						"$size = (Get-PartitionSupportedSize -DiskNumber 5 -PartitionNumber 2)\n",
						"Resize-Partition -DiskNumber 5 -PartitionNumber 2 -Size $size.SizeMax\n",
						"Rename-Computer -NewName ms238cpodsql243 -Restart\n",
						"</powershell>"
					]]}
				}
			}
		},
		"ms238cpodsql244": {
			"Type": "AWS::EC2::Instance",
			"Properties": {
				"AvailabilityZone": "us-east-1c",
				"IamInstanceProfile": "Sysco-ApplicationDefaultInstanceProfile-47RRMF15XFMP",
				"ImageId": "ami-1a659560",
				"InstanceType": "t2.large",
				"KeyName": { "Ref": "PemKey2" },
				"SecurityGroupIds": [{ "Ref": "CPDBSG" }, { "Ref": "NATCLIENT" }, "sg-42dc8b26"],
				"SubnetId": { "Ref": "Conf1c" },
				"BlockDeviceMappings": [
					{"DeviceName": "/dev/sda1", "Ebs": { "VolumeSize": "50", "VolumeType": "gp2" }},
					{"DeviceName": "xvdb", "Ebs": { "VolumeSize": "1", "VolumeType": "gp2" }},
					{"DeviceName": "xvdc", "Ebs": { "VolumeSize": "1", "VolumeType": "gp2" }},
					{"DeviceName": "xvdd", "Ebs": { "VolumeSize": "1", "VolumeType": "gp2" }},
					{"DeviceName": "xvde", "Ebs": { "VolumeSize": "100", "VolumeType": "gp2" }},
					{"DeviceName": "xvdf", "Ebs": { "VolumeSize": "100", "VolumeType": "gp2" }}
				],
				"Tags": [
				  { "Key" : "Name", "Value": "ms238cpodsql244" },
				  { "Key" : "Application_Id", "Value" : { "Ref": "ApplicationId" } },
				  { "Key" : "Application_Name", "Value" : { "Ref": "ApplicationName" } },
				  { "Key" : "Environment", "Value" :  { "Ref": "Environment" } },
				  { "Key" : "PO_Number", "Value" : { "Ref": "PONumber" } },
				  { "Key" : "Project_ID", "Value" : { "Ref": "ProjectId" } },
				  { "Key" : "Owner", "Value" : { "Ref": "Owner" } },
				  { "Key" : "Approver", "Value" : { "Ref": "Approver" } }
				],
				"UserData": {
					"Fn::Base64": { "Fn::Join": [ "", [
						"<powershell>\n",
						"$size = (Get-PartitionSupportedSize -DiskNumber 4 -PartitionNumber 2)\n",
						"Resize-Partition -DiskNumber 4 -PartitionNumber 2 -Size $size.SizeMax\n",
						"$size = (Get-PartitionSupportedSize -DiskNumber 5 -PartitionNumber 2)\n",
						"Resize-Partition -DiskNumber 5 -PartitionNumber 2 -Size $size.SizeMax\n",
						"Rename-Computer -NewName ms238cpodsql244 -Restart\n",
						"</powershell>"
					]]}
				}
			}
		},
		"ms238cpodsql245": {
			"Type": "AWS::EC2::Instance",
			"Properties": {
				"AvailabilityZone": "us-east-1d",
				"IamInstanceProfile": "Sysco-ApplicationDefaultInstanceProfile-47RRMF15XFMP",
				"ImageId": "ami-1a659560",
				"InstanceType": "t2.large",
				"KeyName": { "Ref": "PemKey2" },
				"SecurityGroupIds": [{ "Ref": "CPDBSG" }, { "Ref": "NATCLIENT" }, "sg-42dc8b26"],
				"SubnetId": { "Ref": "Conf1d" },
				"BlockDeviceMappings": [
					{"DeviceName": "/dev/sda1", "Ebs": { "VolumeSize": "50", "VolumeType": "gp2" }},
					{"DeviceName": "xvdb", "Ebs": { "VolumeSize": "1", "VolumeType": "gp2" }},
					{"DeviceName": "xvdc", "Ebs": { "VolumeSize": "1", "VolumeType": "gp2" }},
					{"DeviceName": "xvdd", "Ebs": { "VolumeSize": "1", "VolumeType": "gp2" }},
					{"DeviceName": "xvde", "Ebs": { "VolumeSize": "100", "VolumeType": "gp2" }},
					{"DeviceName": "xvdf", "Ebs": { "VolumeSize": "100", "VolumeType": "gp2" }}
				],
				"Tags": [
				  { "Key" : "Name", "Value": "ms238cpodsql245" },
				  { "Key" : "Application_Id", "Value" : { "Ref": "ApplicationId" } },
				  { "Key" : "Application_Name", "Value" : { "Ref": "ApplicationName" } },
				  { "Key" : "Environment", "Value" :  { "Ref": "Environment" } },
				  { "Key" : "PO_Number", "Value" : { "Ref": "PONumber" } },
				  { "Key" : "Project_ID", "Value" : { "Ref": "ProjectId" } },
				  { "Key" : "Owner", "Value" : { "Ref": "Owner" } },
				  { "Key" : "Approver", "Value" : { "Ref": "Approver" } }
				],
				"UserData": {
					"Fn::Base64": { "Fn::Join": [ "", [
						"<powershell>\n",
						"$size = (Get-PartitionSupportedSize -DiskNumber 4 -PartitionNumber 2)\n",
						"Resize-Partition -DiskNumber 4 -PartitionNumber 2 -Size $size.SizeMax\n",
						"$size = (Get-PartitionSupportedSize -DiskNumber 5 -PartitionNumber 2)\n",
						"Resize-Partition -DiskNumber 5 -PartitionNumber 2 -Size $size.SizeMax\n",
						"Rename-Computer -NewName ms238cpodsql245 -Restart\n",
						"</powershell>"
					]]}
				}
			}
		},
		"ms238cpodsql246": {
			"Type": "AWS::EC2::Instance",
			"Properties": {
				"AvailabilityZone": "us-east-1c",
				"IamInstanceProfile": "Sysco-ApplicationDefaultInstanceProfile-47RRMF15XFMP",
				"ImageId": "ami-1a659560",
				"InstanceType": "t2.large",
				"KeyName": { "Ref": "PemKey2" },
				"SecurityGroupIds": [{ "Ref": "CPDBSG" }, { "Ref": "NATCLIENT" }, "sg-42dc8b26"],
				"SubnetId": { "Ref": "Conf1c" },
				"BlockDeviceMappings": [
					{"DeviceName": "/dev/sda1", "Ebs": { "VolumeSize": "50", "VolumeType": "gp2" }},
					{"DeviceName": "xvdb", "Ebs": { "VolumeSize": "1", "VolumeType": "gp2" }},
					{"DeviceName": "xvdc", "Ebs": { "VolumeSize": "1", "VolumeType": "gp2" }},
					{"DeviceName": "xvdd", "Ebs": { "VolumeSize": "1", "VolumeType": "gp2" }},
					{"DeviceName": "xvde", "Ebs": { "VolumeSize": "100", "VolumeType": "gp2" }},
					{"DeviceName": "xvdf", "Ebs": { "VolumeSize": "100", "VolumeType": "gp2" }}
				],
				"Tags": [
				  { "Key" : "Name", "Value": "ms238cpodsql246" },
				  { "Key" : "Application_Id", "Value" : { "Ref": "ApplicationId" } },
				  { "Key" : "Application_Name", "Value" : { "Ref": "ApplicationName" } },
				  { "Key" : "Environment", "Value" :  { "Ref": "Environment" } },
				  { "Key" : "PO_Number", "Value" : { "Ref": "PONumber" } },
				  { "Key" : "Project_ID", "Value" : { "Ref": "ProjectId" } },
				  { "Key" : "Owner", "Value" : { "Ref": "Owner" } },
				  { "Key" : "Approver", "Value" : { "Ref": "Approver" } }
				],
				"UserData": {
					"Fn::Base64": { "Fn::Join": [ "", [
						"<powershell>\n",
						"$size = (Get-PartitionSupportedSize -DiskNumber 4 -PartitionNumber 2)\n",
						"Resize-Partition -DiskNumber 4 -PartitionNumber 2 -Size $size.SizeMax\n",
						"$size = (Get-PartitionSupportedSize -DiskNumber 5 -PartitionNumber 2)\n",
						"Resize-Partition -DiskNumber 5 -PartitionNumber 2 -Size $size.SizeMax\n",
						"Rename-Computer -NewName ms238cpodsql246 -Restart\n",
						"</powershell>"
					]]}
				}
			}
		},
		"ms238cpodsql247": {
			"Type": "AWS::EC2::Instance",
			"Properties": {
				"AvailabilityZone": "us-east-1d",
				"IamInstanceProfile": "Sysco-ApplicationDefaultInstanceProfile-47RRMF15XFMP",
				"ImageId": "ami-1a659560",
				"InstanceType": "t2.large",
				"KeyName": { "Ref": "PemKey2" },
				"SecurityGroupIds": [{ "Ref": "CPDBSG" }, { "Ref": "NATCLIENT" }, "sg-42dc8b26"],
				"SubnetId": { "Ref": "Conf1d" },
				"BlockDeviceMappings": [
					{"DeviceName": "/dev/sda1", "Ebs": { "VolumeSize": "50", "VolumeType": "gp2" }},
					{"DeviceName": "xvdb", "Ebs": { "VolumeSize": "1", "VolumeType": "gp2" }},
					{"DeviceName": "xvdc", "Ebs": { "VolumeSize": "1", "VolumeType": "gp2" }},
					{"DeviceName": "xvdd", "Ebs": { "VolumeSize": "1", "VolumeType": "gp2" }},
					{"DeviceName": "xvde", "Ebs": { "VolumeSize": "100", "VolumeType": "gp2" }},
					{"DeviceName": "xvdf", "Ebs": { "VolumeSize": "100", "VolumeType": "gp2" }}
				],
				"Tags": [
				  { "Key" : "Name", "Value": "ms238cpodsql247" },
				  { "Key" : "Application_Id", "Value" : { "Ref": "ApplicationId" } },
				  { "Key" : "Application_Name", "Value" : { "Ref": "ApplicationName" } },
				  { "Key" : "Environment", "Value" :  { "Ref": "Environment" } },
				  { "Key" : "PO_Number", "Value" : { "Ref": "PONumber" } },
				  { "Key" : "Project_ID", "Value" : { "Ref": "ProjectId" } },
				  { "Key" : "Owner", "Value" : { "Ref": "Owner" } },
				  { "Key" : "Approver", "Value" : { "Ref": "Approver" } }
				],
				"UserData": {
					"Fn::Base64": { "Fn::Join": [ "", [
						"<powershell>\n",
						"$size = (Get-PartitionSupportedSize -DiskNumber 4 -PartitionNumber 2)\n",
						"Resize-Partition -DiskNumber 4 -PartitionNumber 2 -Size $size.SizeMax\n",
						"$size = (Get-PartitionSupportedSize -DiskNumber 5 -PartitionNumber 2)\n",
						"Resize-Partition -DiskNumber 5 -PartitionNumber 2 -Size $size.SizeMax\n",
						"Rename-Computer -NewName ms238cpodsql247 -Restart\n",
						"</powershell>"
					]]}
				}
			}
		},
		"ms238cpodsql248": {
			"Type": "AWS::EC2::Instance",
			"Properties": {
				"AvailabilityZone": "us-east-1c",
				"IamInstanceProfile": "Sysco-ApplicationDefaultInstanceProfile-47RRMF15XFMP",
				"ImageId": "ami-1a659560",
				"InstanceType": "t2.large",
				"KeyName": { "Ref": "PemKey2" },
				"SecurityGroupIds": [{ "Ref": "CPDBSG" }, { "Ref": "NATCLIENT" }, "sg-42dc8b26"],
				"SubnetId": { "Ref": "Conf1c" },
				"BlockDeviceMappings": [
					{"DeviceName": "/dev/sda1", "Ebs": { "VolumeSize": "50", "VolumeType": "gp2" }},
					{"DeviceName": "xvdb", "Ebs": { "VolumeSize": "1", "VolumeType": "gp2" }},
					{"DeviceName": "xvdc", "Ebs": { "VolumeSize": "1", "VolumeType": "gp2" }},
					{"DeviceName": "xvdd", "Ebs": { "VolumeSize": "1", "VolumeType": "gp2" }},
					{"DeviceName": "xvde", "Ebs": { "VolumeSize": "100", "VolumeType": "gp2" }},
					{"DeviceName": "xvdf", "Ebs": { "VolumeSize": "100", "VolumeType": "gp2" }}
				],
				"Tags": [
				  { "Key" : "Name", "Value": "ms238cpodsql248" },
				  { "Key" : "Application_Id", "Value" : { "Ref": "ApplicationId" } },
				  { "Key" : "Application_Name", "Value" : { "Ref": "ApplicationName" } },
				  { "Key" : "Environment", "Value" :  { "Ref": "Environment" } },
				  { "Key" : "PO_Number", "Value" : { "Ref": "PONumber" } },
				  { "Key" : "Project_ID", "Value" : { "Ref": "ProjectId" } },
				  { "Key" : "Owner", "Value" : { "Ref": "Owner" } },
				  { "Key" : "Approver", "Value" : { "Ref": "Approver" } }
				],
				"UserData": {
					"Fn::Base64": { "Fn::Join": [ "", [
						"<powershell>\n",
						"$size = (Get-PartitionSupportedSize -DiskNumber 4 -PartitionNumber 2)\n",
						"Resize-Partition -DiskNumber 4 -PartitionNumber 2 -Size $size.SizeMax\n",
						"$size = (Get-PartitionSupportedSize -DiskNumber 5 -PartitionNumber 2)\n",
						"Resize-Partition -DiskNumber 5 -PartitionNumber 2 -Size $size.SizeMax\n",
						"Rename-Computer -NewName ms238cpodsql248 -Restart\n",
						"</powershell>"
					]]}
				}
			}
		},
		"ms238cpodsql249": {
			"Type": "AWS::EC2::Instance",
			"Properties": {
				"AvailabilityZone": "us-east-1d",
				"IamInstanceProfile": "Sysco-ApplicationDefaultInstanceProfile-47RRMF15XFMP",
				"ImageId": "ami-1a659560",
				"InstanceType": "t2.large",
				"KeyName": { "Ref": "PemKey2" },
				"SecurityGroupIds": [{ "Ref": "CPDBSG" }, { "Ref": "NATCLIENT" }, "sg-42dc8b26"],
				"SubnetId": { "Ref": "Conf1d" },
				"BlockDeviceMappings": [
					{"DeviceName": "/dev/sda1", "Ebs": { "VolumeSize": "50", "VolumeType": "gp2" }},
					{"DeviceName": "xvdb", "Ebs": { "VolumeSize": "1", "VolumeType": "gp2" }},
					{"DeviceName": "xvdc", "Ebs": { "VolumeSize": "1", "VolumeType": "gp2" }},
					{"DeviceName": "xvdd", "Ebs": { "VolumeSize": "1", "VolumeType": "gp2" }},
					{"DeviceName": "xvde", "Ebs": { "VolumeSize": "100", "VolumeType": "gp2" }},
					{"DeviceName": "xvdf", "Ebs": { "VolumeSize": "100", "VolumeType": "gp2" }}
				],
				"Tags": [
				  { "Key" : "Name", "Value": "ms238cpodsql249" },
				  { "Key" : "Application_Id", "Value" : { "Ref": "ApplicationId" } },
				  { "Key" : "Application_Name", "Value" : { "Ref": "ApplicationName" } },
				  { "Key" : "Environment", "Value" :  { "Ref": "Environment" } },
				  { "Key" : "PO_Number", "Value" : { "Ref": "PONumber" } },
				  { "Key" : "Project_ID", "Value" : { "Ref": "ProjectId" } },
				  { "Key" : "Owner", "Value" : { "Ref": "Owner" } },
				  { "Key" : "Approver", "Value" : { "Ref": "Approver" } }
				],
				"UserData": {
					"Fn::Base64": { "Fn::Join": [ "", [
						"<powershell>\n",
						"$size = (Get-PartitionSupportedSize -DiskNumber 4 -PartitionNumber 2)\n",
						"Resize-Partition -DiskNumber 4 -PartitionNumber 2 -Size $size.SizeMax\n",
						"$size = (Get-PartitionSupportedSize -DiskNumber 5 -PartitionNumber 2)\n",
						"Resize-Partition -DiskNumber 5 -PartitionNumber 2 -Size $size.SizeMax\n",
						"Rename-Computer -NewName ms238cpodsql249 -Restart\n",
						"</powershell>"
					]]}
				}
			}
		},
		"ms238cpodsql250": {
			"Type": "AWS::EC2::Instance",
			"Properties": {
				"AvailabilityZone": "us-east-1c",
				"IamInstanceProfile": "Sysco-ApplicationDefaultInstanceProfile-47RRMF15XFMP",
				"ImageId": "ami-1a659560",
				"InstanceType": "t2.large",
				"KeyName": { "Ref": "PemKey2" },
				"SecurityGroupIds": [{ "Ref": "CPDBSG" }, { "Ref": "NATCLIENT" }, "sg-42dc8b26"],
				"SubnetId": { "Ref": "Conf1c" },
				"BlockDeviceMappings": [
					{"DeviceName": "/dev/sda1", "Ebs": { "VolumeSize": "50", "VolumeType": "gp2" }},
					{"DeviceName": "xvdb", "Ebs": { "VolumeSize": "1", "VolumeType": "gp2" }},
					{"DeviceName": "xvdc", "Ebs": { "VolumeSize": "1", "VolumeType": "gp2" }},
					{"DeviceName": "xvdd", "Ebs": { "VolumeSize": "1", "VolumeType": "gp2" }},
					{"DeviceName": "xvde", "Ebs": { "VolumeSize": "100", "VolumeType": "gp2" }},
					{"DeviceName": "xvdf", "Ebs": { "VolumeSize": "100", "VolumeType": "gp2" }}
				],
				"Tags": [
				  { "Key" : "Name", "Value": "ms238cpodsql250" },
				  { "Key" : "Application_Id", "Value" : { "Ref": "ApplicationId" } },
				  { "Key" : "Application_Name", "Value" : { "Ref": "ApplicationName" } },
				  { "Key" : "Environment", "Value" :  { "Ref": "Environment" } },
				  { "Key" : "PO_Number", "Value" : { "Ref": "PONumber" } },
				  { "Key" : "Project_ID", "Value" : { "Ref": "ProjectId" } },
				  { "Key" : "Owner", "Value" : { "Ref": "Owner" } },
				  { "Key" : "Approver", "Value" : { "Ref": "Approver" } }
				],
				"UserData": {
					"Fn::Base64": { "Fn::Join": [ "", [
						"<powershell>\n",
						"$size = (Get-PartitionSupportedSize -DiskNumber 4 -PartitionNumber 2)\n",
						"Resize-Partition -DiskNumber 4 -PartitionNumber 2 -Size $size.SizeMax\n",
						"$size = (Get-PartitionSupportedSize -DiskNumber 5 -PartitionNumber 2)\n",
						"Resize-Partition -DiskNumber 5 -PartitionNumber 2 -Size $size.SizeMax\n",
						"Rename-Computer -NewName ms238cpodsql250 -Restart\n",
						"</powershell>"
					]]}
				}
			}
		},
		"ms238cpodsql251": {
			"Type": "AWS::EC2::Instance",
			"Properties": {
				"AvailabilityZone": "us-east-1d",
				"IamInstanceProfile": "Sysco-ApplicationDefaultInstanceProfile-47RRMF15XFMP",
				"ImageId": "ami-1a659560",
				"InstanceType": "t2.large",
				"KeyName": { "Ref": "PemKey2" },
				"SecurityGroupIds": [{ "Ref": "CPDBSG" }, { "Ref": "NATCLIENT" }, "sg-42dc8b26"],
				"SubnetId": { "Ref": "Conf1d" },
				"BlockDeviceMappings": [
					{"DeviceName": "/dev/sda1", "Ebs": { "VolumeSize": "50", "VolumeType": "gp2" }},
					{"DeviceName": "xvdb", "Ebs": { "VolumeSize": "1", "VolumeType": "gp2" }},
					{"DeviceName": "xvdc", "Ebs": { "VolumeSize": "1", "VolumeType": "gp2" }},
					{"DeviceName": "xvdd", "Ebs": { "VolumeSize": "1", "VolumeType": "gp2" }},
					{"DeviceName": "xvde", "Ebs": { "VolumeSize": "100", "VolumeType": "gp2" }},
					{"DeviceName": "xvdf", "Ebs": { "VolumeSize": "100", "VolumeType": "gp2" }}
				],
				"Tags": [
				  { "Key" : "Name", "Value": "ms238cpodsql251" },
				  { "Key" : "Application_Id", "Value" : { "Ref": "ApplicationId" } },
				  { "Key" : "Application_Name", "Value" : { "Ref": "ApplicationName" } },
				  { "Key" : "Environment", "Value" :  { "Ref": "Environment" } },
				  { "Key" : "PO_Number", "Value" : { "Ref": "PONumber" } },
				  { "Key" : "Project_ID", "Value" : { "Ref": "ProjectId" } },
				  { "Key" : "Owner", "Value" : { "Ref": "Owner" } },
				  { "Key" : "Approver", "Value" : { "Ref": "Approver" } }
				],
				"UserData": {
					"Fn::Base64": { "Fn::Join": [ "", [
						"<powershell>\n",
						"$size = (Get-PartitionSupportedSize -DiskNumber 4 -PartitionNumber 2)\n",
						"Resize-Partition -DiskNumber 4 -PartitionNumber 2 -Size $size.SizeMax\n",
						"$size = (Get-PartitionSupportedSize -DiskNumber 5 -PartitionNumber 2)\n",
						"Resize-Partition -DiskNumber 5 -PartitionNumber 2 -Size $size.SizeMax\n",
						"Rename-Computer -NewName ms238cpodsql251 -Restart\n",
						"</powershell>"
					]]}
				}
			}
		},
		"ms238cpodsql252": {
			"Type": "AWS::EC2::Instance",
			"Properties": {
				"AvailabilityZone": "us-east-1c",
				"IamInstanceProfile": "Sysco-ApplicationDefaultInstanceProfile-47RRMF15XFMP",
				"ImageId": "ami-1a659560",
				"InstanceType": "t2.large",
				"KeyName": { "Ref": "PemKey2" },
				"SecurityGroupIds": [{ "Ref": "CPDBSG" }, { "Ref": "NATCLIENT" }, "sg-42dc8b26"],
				"SubnetId": { "Ref": "Conf1c" },
				"BlockDeviceMappings": [
					{"DeviceName": "/dev/sda1", "Ebs": { "VolumeSize": "50", "VolumeType": "gp2" }},
					{"DeviceName": "xvdb", "Ebs": { "VolumeSize": "1", "VolumeType": "gp2" }},
					{"DeviceName": "xvdc", "Ebs": { "VolumeSize": "1", "VolumeType": "gp2" }},
					{"DeviceName": "xvdd", "Ebs": { "VolumeSize": "1", "VolumeType": "gp2" }},
					{"DeviceName": "xvde", "Ebs": { "VolumeSize": "100", "VolumeType": "gp2" }},
					{"DeviceName": "xvdf", "Ebs": { "VolumeSize": "100", "VolumeType": "gp2" }}
				],
				"Tags": [
				  { "Key" : "Name", "Value": "ms238cpodsql252" },
				  { "Key" : "Application_Id", "Value" : { "Ref": "ApplicationId" } },
				  { "Key" : "Application_Name", "Value" : { "Ref": "ApplicationName" } },
				  { "Key" : "Environment", "Value" :  { "Ref": "Environment" } },
				  { "Key" : "PO_Number", "Value" : { "Ref": "PONumber" } },
				  { "Key" : "Project_ID", "Value" : { "Ref": "ProjectId" } },
				  { "Key" : "Owner", "Value" : { "Ref": "Owner" } },
				  { "Key" : "Approver", "Value" : { "Ref": "Approver" } }
				],
				"UserData": {
					"Fn::Base64": { "Fn::Join": [ "", [
						"<powershell>\n",
						"$size = (Get-PartitionSupportedSize -DiskNumber 4 -PartitionNumber 2)\n",
						"Resize-Partition -DiskNumber 4 -PartitionNumber 2 -Size $size.SizeMax\n",
						"$size = (Get-PartitionSupportedSize -DiskNumber 5 -PartitionNumber 2)\n",
						"Resize-Partition -DiskNumber 5 -PartitionNumber 2 -Size $size.SizeMax\n",
						"Rename-Computer -NewName ms238cpodsql252 -Restart\n",
						"</powershell>"
					]]}
				}
			}
		},
		"ms238cpodsql253": {
			"Type": "AWS::EC2::Instance",
			"Properties": {
				"AvailabilityZone": "us-east-1d",
				"IamInstanceProfile": "Sysco-ApplicationDefaultInstanceProfile-47RRMF15XFMP",
				"ImageId": "ami-1a659560",
				"InstanceType": "t2.large",
				"KeyName": { "Ref": "PemKey2" },
				"SecurityGroupIds": [{ "Ref": "CPDBSG" }, { "Ref": "NATCLIENT" }, "sg-42dc8b26"],
				"SubnetId": { "Ref": "Conf1d" },
				"BlockDeviceMappings": [
					{"DeviceName": "/dev/sda1", "Ebs": { "VolumeSize": "50", "VolumeType": "gp2" }},
					{"DeviceName": "xvdb", "Ebs": { "VolumeSize": "1", "VolumeType": "gp2" }},
					{"DeviceName": "xvdc", "Ebs": { "VolumeSize": "1", "VolumeType": "gp2" }},
					{"DeviceName": "xvdd", "Ebs": { "VolumeSize": "1", "VolumeType": "gp2" }},
					{"DeviceName": "xvde", "Ebs": { "VolumeSize": "100", "VolumeType": "gp2" }},
					{"DeviceName": "xvdf", "Ebs": { "VolumeSize": "100", "VolumeType": "gp2" }}
				],
				"Tags": [
				  { "Key" : "Name", "Value": "ms238cpodsql253" },
				  { "Key" : "Application_Id", "Value" : { "Ref": "ApplicationId" } },
				  { "Key" : "Application_Name", "Value" : { "Ref": "ApplicationName" } },
				  { "Key" : "Environment", "Value" :  { "Ref": "Environment" } },
				  { "Key" : "PO_Number", "Value" : { "Ref": "PONumber" } },
				  { "Key" : "Project_ID", "Value" : { "Ref": "ProjectId" } },
				  { "Key" : "Owner", "Value" : { "Ref": "Owner" } },
				  { "Key" : "Approver", "Value" : { "Ref": "Approver" } }
				],
				"UserData": {
					"Fn::Base64": { "Fn::Join": [ "", [
						"<powershell>\n",
						"$size = (Get-PartitionSupportedSize -DiskNumber 4 -PartitionNumber 2)\n",
						"Resize-Partition -DiskNumber 4 -PartitionNumber 2 -Size $size.SizeMax\n",
						"$size = (Get-PartitionSupportedSize -DiskNumber 5 -PartitionNumber 2)\n",
						"Resize-Partition -DiskNumber 5 -PartitionNumber 2 -Size $size.SizeMax\n",
						"Rename-Computer -NewName ms238cpodsql253 -Restart\n",
						"</powershell>"
					]]}
				}
			}
		},
		"ms238cpodsql254": {
			"Type": "AWS::EC2::Instance",
			"Properties": {
				"AvailabilityZone": "us-east-1c",
				"IamInstanceProfile": "Sysco-ApplicationDefaultInstanceProfile-47RRMF15XFMP",
				"ImageId": "ami-1a659560",
				"InstanceType": "t2.large",
				"KeyName": { "Ref": "PemKey2" },
				"SecurityGroupIds": [{ "Ref": "CPDBSG" }, { "Ref": "NATCLIENT" }, "sg-42dc8b26"],
				"SubnetId": { "Ref": "Conf1c" },
				"BlockDeviceMappings": [
					{"DeviceName": "/dev/sda1", "Ebs": { "VolumeSize": "50", "VolumeType": "gp2" }},
					{"DeviceName": "xvdb", "Ebs": { "VolumeSize": "1", "VolumeType": "gp2" }},
					{"DeviceName": "xvdc", "Ebs": { "VolumeSize": "1", "VolumeType": "gp2" }},
					{"DeviceName": "xvdd", "Ebs": { "VolumeSize": "1", "VolumeType": "gp2" }},
					{"DeviceName": "xvde", "Ebs": { "VolumeSize": "100", "VolumeType": "gp2" }},
					{"DeviceName": "xvdf", "Ebs": { "VolumeSize": "100", "VolumeType": "gp2" }}
				],
				"Tags": [
				  { "Key" : "Name", "Value": "ms238cpodsql254" },
				  { "Key" : "Application_Id", "Value" : { "Ref": "ApplicationId" } },
				  { "Key" : "Application_Name", "Value" : { "Ref": "ApplicationName" } },
				  { "Key" : "Environment", "Value" :  { "Ref": "Environment" } },
				  { "Key" : "PO_Number", "Value" : { "Ref": "PONumber" } },
				  { "Key" : "Project_ID", "Value" : { "Ref": "ProjectId" } },
				  { "Key" : "Owner", "Value" : { "Ref": "Owner" } },
				  { "Key" : "Approver", "Value" : { "Ref": "Approver" } }
				],
				"UserData": {
					"Fn::Base64": { "Fn::Join": [ "", [
						"<powershell>\n",
						"$size = (Get-PartitionSupportedSize -DiskNumber 4 -PartitionNumber 2)\n",
						"Resize-Partition -DiskNumber 4 -PartitionNumber 2 -Size $size.SizeMax\n",
						"$size = (Get-PartitionSupportedSize -DiskNumber 5 -PartitionNumber 2)\n",
						"Resize-Partition -DiskNumber 5 -PartitionNumber 2 -Size $size.SizeMax\n",
						"Rename-Computer -NewName ms238cpodsql254 -Restart\n",
						"</powershell>"
					]]}
				}
			}
		},
		"ms238cpodsql255": {
			"Type": "AWS::EC2::Instance",
			"Properties": {
				"AvailabilityZone": "us-east-1d",
				"IamInstanceProfile": "Sysco-ApplicationDefaultInstanceProfile-47RRMF15XFMP",
				"ImageId": "ami-1a659560",
				"InstanceType": "t2.large",
				"KeyName": { "Ref": "PemKey2" },
				"SecurityGroupIds": [{ "Ref": "CPDBSG" }, { "Ref": "NATCLIENT" }, "sg-42dc8b26"],
				"SubnetId": { "Ref": "Conf1d" },
				"BlockDeviceMappings": [
					{"DeviceName": "/dev/sda1", "Ebs": { "VolumeSize": "50", "VolumeType": "gp2" }},
					{"DeviceName": "xvdb", "Ebs": { "VolumeSize": "1", "VolumeType": "gp2" }},
					{"DeviceName": "xvdc", "Ebs": { "VolumeSize": "1", "VolumeType": "gp2" }},
					{"DeviceName": "xvdd", "Ebs": { "VolumeSize": "1", "VolumeType": "gp2" }},
					{"DeviceName": "xvde", "Ebs": { "VolumeSize": "100", "VolumeType": "gp2" }},
					{"DeviceName": "xvdf", "Ebs": { "VolumeSize": "100", "VolumeType": "gp2" }}
				],
				"Tags": [
				  { "Key" : "Name", "Value": "ms238cpodsql255" },
				  { "Key" : "Application_Id", "Value" : { "Ref": "ApplicationId" } },
				  { "Key" : "Application_Name", "Value" : { "Ref": "ApplicationName" } },
				  { "Key" : "Environment", "Value" :  { "Ref": "Environment" } },
				  { "Key" : "PO_Number", "Value" : { "Ref": "PONumber" } },
				  { "Key" : "Project_ID", "Value" : { "Ref": "ProjectId" } },
				  { "Key" : "Owner", "Value" : { "Ref": "Owner" } },
				  { "Key" : "Approver", "Value" : { "Ref": "Approver" } }
				],
				"UserData": {
					"Fn::Base64": { "Fn::Join": [ "", [
						"<powershell>\n",
						"$size = (Get-PartitionSupportedSize -DiskNumber 4 -PartitionNumber 2)\n",
						"Resize-Partition -DiskNumber 4 -PartitionNumber 2 -Size $size.SizeMax\n",
						"$size = (Get-PartitionSupportedSize -DiskNumber 5 -PartitionNumber 2)\n",
						"Resize-Partition -DiskNumber 5 -PartitionNumber 2 -Size $size.SizeMax\n",
						"Rename-Computer -NewName ms238cpodsql255 -Restart\n",
						"</powershell>"
					]]}
				}
			}
		},
		"ms238cpodsql256": {
			"Type": "AWS::EC2::Instance",
			"Properties": {
				"AvailabilityZone": "us-east-1c",
				"IamInstanceProfile": "Sysco-ApplicationDefaultInstanceProfile-47RRMF15XFMP",
				"ImageId": "ami-1a659560",
				"InstanceType": "t2.large",
				"KeyName": { "Ref": "PemKey2" },
				"SecurityGroupIds": [{ "Ref": "CPDBSG" }, { "Ref": "NATCLIENT" }, "sg-42dc8b26"],
				"SubnetId": { "Ref": "Conf1c" },
				"BlockDeviceMappings": [
					{"DeviceName": "/dev/sda1", "Ebs": { "VolumeSize": "50", "VolumeType": "gp2" }},
					{"DeviceName": "xvdb", "Ebs": { "VolumeSize": "1", "VolumeType": "gp2" }},
					{"DeviceName": "xvdc", "Ebs": { "VolumeSize": "1", "VolumeType": "gp2" }},
					{"DeviceName": "xvdd", "Ebs": { "VolumeSize": "1", "VolumeType": "gp2" }},
					{"DeviceName": "xvde", "Ebs": { "VolumeSize": "100", "VolumeType": "gp2" }},
					{"DeviceName": "xvdf", "Ebs": { "VolumeSize": "100", "VolumeType": "gp2" }}
				],
				"Tags": [
				  { "Key" : "Name", "Value": "ms238cpodsql256" },
				  { "Key" : "Application_Id", "Value" : { "Ref": "ApplicationId" } },
				  { "Key" : "Application_Name", "Value" : { "Ref": "ApplicationName" } },
				  { "Key" : "Environment", "Value" :  { "Ref": "Environment" } },
				  { "Key" : "PO_Number", "Value" : { "Ref": "PONumber" } },
				  { "Key" : "Project_ID", "Value" : { "Ref": "ProjectId" } },
				  { "Key" : "Owner", "Value" : { "Ref": "Owner" } },
				  { "Key" : "Approver", "Value" : { "Ref": "Approver" } }
				],
				"UserData": {
					"Fn::Base64": { "Fn::Join": [ "", [
						"<powershell>\n",
						"$size = (Get-PartitionSupportedSize -DiskNumber 4 -PartitionNumber 2)\n",
						"Resize-Partition -DiskNumber 4 -PartitionNumber 2 -Size $size.SizeMax\n",
						"$size = (Get-PartitionSupportedSize -DiskNumber 5 -PartitionNumber 2)\n",
						"Resize-Partition -DiskNumber 5 -PartitionNumber 2 -Size $size.SizeMax\n",
						"Rename-Computer -NewName ms238cpodsql256 -Restart\n",
						"</powershell>"
					]]}
				}
			}
		},
		"ms238cpodsql257": {
			"Type": "AWS::EC2::Instance",
			"Properties": {
				"AvailabilityZone": "us-east-1d",
				"IamInstanceProfile": "Sysco-ApplicationDefaultInstanceProfile-47RRMF15XFMP",
				"ImageId": "ami-1a659560",
				"InstanceType": "t2.large",
				"KeyName": { "Ref": "PemKey2" },
				"SecurityGroupIds": [{ "Ref": "CPDBSG" }, { "Ref": "NATCLIENT" }, "sg-42dc8b26"],
				"SubnetId": { "Ref": "Conf1d" },
				"BlockDeviceMappings": [
					{"DeviceName": "/dev/sda1", "Ebs": { "VolumeSize": "50", "VolumeType": "gp2" }},
					{"DeviceName": "xvdb", "Ebs": { "VolumeSize": "1", "VolumeType": "gp2" }},
					{"DeviceName": "xvdc", "Ebs": { "VolumeSize": "1", "VolumeType": "gp2" }},
					{"DeviceName": "xvdd", "Ebs": { "VolumeSize": "1", "VolumeType": "gp2" }},
					{"DeviceName": "xvde", "Ebs": { "VolumeSize": "100", "VolumeType": "gp2" }},
					{"DeviceName": "xvdf", "Ebs": { "VolumeSize": "100", "VolumeType": "gp2" }}
				],
				"Tags": [
				  { "Key" : "Name", "Value": "ms238cpodsql257" },
				  { "Key" : "Application_Id", "Value" : { "Ref": "ApplicationId" } },
				  { "Key" : "Application_Name", "Value" : { "Ref": "ApplicationName" } },
				  { "Key" : "Environment", "Value" :  { "Ref": "Environment" } },
				  { "Key" : "PO_Number", "Value" : { "Ref": "PONumber" } },
				  { "Key" : "Project_ID", "Value" : { "Ref": "ProjectId" } },
				  { "Key" : "Owner", "Value" : { "Ref": "Owner" } },
				  { "Key" : "Approver", "Value" : { "Ref": "Approver" } }
				],
				"UserData": {
					"Fn::Base64": { "Fn::Join": [ "", [
						"<powershell>\n",
						"$size = (Get-PartitionSupportedSize -DiskNumber 4 -PartitionNumber 2)\n",
						"Resize-Partition -DiskNumber 4 -PartitionNumber 2 -Size $size.SizeMax\n",
						"$size = (Get-PartitionSupportedSize -DiskNumber 5 -PartitionNumber 2)\n",
						"Resize-Partition -DiskNumber 5 -PartitionNumber 2 -Size $size.SizeMax\n",
						"Rename-Computer -NewName ms238cpodsql257 -Restart\n",
						"</powershell>"
					]]}
				}
			}
		},
		"ms238cpodsql258": {
			"Type": "AWS::EC2::Instance",
			"Properties": {
				"AvailabilityZone": "us-east-1c",
				"IamInstanceProfile": "Sysco-ApplicationDefaultInstanceProfile-47RRMF15XFMP",
				"ImageId": "ami-1a659560",
				"InstanceType": "t2.large",
				"KeyName": { "Ref": "PemKey2" },
				"SecurityGroupIds": [{ "Ref": "CPDBSG" }, { "Ref": "NATCLIENT" }, "sg-42dc8b26"],
				"SubnetId": { "Ref": "Conf1c" },
				"BlockDeviceMappings": [
					{"DeviceName": "/dev/sda1", "Ebs": { "VolumeSize": "50", "VolumeType": "gp2" }},
					{"DeviceName": "xvdb", "Ebs": { "VolumeSize": "1", "VolumeType": "gp2" }},
					{"DeviceName": "xvdc", "Ebs": { "VolumeSize": "1", "VolumeType": "gp2" }},
					{"DeviceName": "xvdd", "Ebs": { "VolumeSize": "1", "VolumeType": "gp2" }},
					{"DeviceName": "xvde", "Ebs": { "VolumeSize": "100", "VolumeType": "gp2" }},
					{"DeviceName": "xvdf", "Ebs": { "VolumeSize": "100", "VolumeType": "gp2" }}
				],
				"Tags": [
				  { "Key" : "Name", "Value": "ms238cpodsql258" },
				  { "Key" : "Application_Id", "Value" : { "Ref": "ApplicationId" } },
				  { "Key" : "Application_Name", "Value" : { "Ref": "ApplicationName" } },
				  { "Key" : "Environment", "Value" :  { "Ref": "Environment" } },
				  { "Key" : "PO_Number", "Value" : { "Ref": "PONumber" } },
				  { "Key" : "Project_ID", "Value" : { "Ref": "ProjectId" } },
				  { "Key" : "Owner", "Value" : { "Ref": "Owner" } },
				  { "Key" : "Approver", "Value" : { "Ref": "Approver" } }
				],
				"UserData": {
					"Fn::Base64": { "Fn::Join": [ "", [
						"<powershell>\n",
						"$size = (Get-PartitionSupportedSize -DiskNumber 4 -PartitionNumber 2)\n",
						"Resize-Partition -DiskNumber 4 -PartitionNumber 2 -Size $size.SizeMax\n",
						"$size = (Get-PartitionSupportedSize -DiskNumber 5 -PartitionNumber 2)\n",
						"Resize-Partition -DiskNumber 5 -PartitionNumber 2 -Size $size.SizeMax\n",
						"Rename-Computer -NewName ms238cpodsql258 -Restart\n",
						"</powershell>"
					]]}
				}
			}
		},
		"ms238cpodsql259": {
			"Type": "AWS::EC2::Instance",
			"Properties": {
				"AvailabilityZone": "us-east-1d",
				"IamInstanceProfile": "Sysco-ApplicationDefaultInstanceProfile-47RRMF15XFMP",
				"ImageId": "ami-1a659560",
				"InstanceType": "t2.large",
				"KeyName": { "Ref": "PemKey2" },
				"SecurityGroupIds": [{ "Ref": "CPDBSG" }, { "Ref": "NATCLIENT" }, "sg-42dc8b26"],
				"SubnetId": { "Ref": "Conf1d" },
				"BlockDeviceMappings": [
					{"DeviceName": "/dev/sda1", "Ebs": { "VolumeSize": "50", "VolumeType": "gp2" }},
					{"DeviceName": "xvdb", "Ebs": { "VolumeSize": "1", "VolumeType": "gp2" }},
					{"DeviceName": "xvdc", "Ebs": { "VolumeSize": "1", "VolumeType": "gp2" }},
					{"DeviceName": "xvdd", "Ebs": { "VolumeSize": "1", "VolumeType": "gp2" }},
					{"DeviceName": "xvde", "Ebs": { "VolumeSize": "100", "VolumeType": "gp2" }},
					{"DeviceName": "xvdf", "Ebs": { "VolumeSize": "100", "VolumeType": "gp2" }}
				],
				"Tags": [
				  { "Key" : "Name", "Value": "ms238cpodsql259" },
				  { "Key" : "Application_Id", "Value" : { "Ref": "ApplicationId" } },
				  { "Key" : "Application_Name", "Value" : { "Ref": "ApplicationName" } },
				  { "Key" : "Environment", "Value" :  { "Ref": "Environment" } },
				  { "Key" : "PO_Number", "Value" : { "Ref": "PONumber" } },
				  { "Key" : "Project_ID", "Value" : { "Ref": "ProjectId" } },
				  { "Key" : "Owner", "Value" : { "Ref": "Owner" } },
				  { "Key" : "Approver", "Value" : { "Ref": "Approver" } }
				],
				"UserData": {
					"Fn::Base64": { "Fn::Join": [ "", [
						"<powershell>\n",
						"$size = (Get-PartitionSupportedSize -DiskNumber 4 -PartitionNumber 2)\n",
						"Resize-Partition -DiskNumber 4 -PartitionNumber 2 -Size $size.SizeMax\n",
						"$size = (Get-PartitionSupportedSize -DiskNumber 5 -PartitionNumber 2)\n",
						"Resize-Partition -DiskNumber 5 -PartitionNumber 2 -Size $size.SizeMax\n",
						"Rename-Computer -NewName ms238cpodsql259 -Restart\n",
						"</powershell>"
					]]}
				}
			}
		},
		"ms238cpodsql260": {
			"Type": "AWS::EC2::Instance",
			"Properties": {
				"AvailabilityZone": "us-east-1c",
				"IamInstanceProfile": "Sysco-ApplicationDefaultInstanceProfile-47RRMF15XFMP",
				"ImageId": "ami-1a659560",
				"InstanceType": "t2.large",
				"KeyName": { "Ref": "PemKey2" },
				"SecurityGroupIds": [{ "Ref": "CPDBSG" }, { "Ref": "NATCLIENT" }, "sg-42dc8b26"],
				"SubnetId": { "Ref": "Conf1c" },
				"BlockDeviceMappings": [
					{"DeviceName": "/dev/sda1", "Ebs": { "VolumeSize": "50", "VolumeType": "gp2" }},
					{"DeviceName": "xvdb", "Ebs": { "VolumeSize": "1", "VolumeType": "gp2" }},
					{"DeviceName": "xvdc", "Ebs": { "VolumeSize": "1", "VolumeType": "gp2" }},
					{"DeviceName": "xvdd", "Ebs": { "VolumeSize": "1", "VolumeType": "gp2" }},
					{"DeviceName": "xvde", "Ebs": { "VolumeSize": "100", "VolumeType": "gp2" }},
					{"DeviceName": "xvdf", "Ebs": { "VolumeSize": "100", "VolumeType": "gp2" }}
				],
				"Tags": [
				  { "Key" : "Name", "Value": "ms238cpodsql260" },
				  { "Key" : "Application_Id", "Value" : { "Ref": "ApplicationId" } },
				  { "Key" : "Application_Name", "Value" : { "Ref": "ApplicationName" } },
				  { "Key" : "Environment", "Value" :  { "Ref": "Environment" } },
				  { "Key" : "PO_Number", "Value" : { "Ref": "PONumber" } },
				  { "Key" : "Project_ID", "Value" : { "Ref": "ProjectId" } },
				  { "Key" : "Owner", "Value" : { "Ref": "Owner" } },
				  { "Key" : "Approver", "Value" : { "Ref": "Approver" } }
				],
				"UserData": {
					"Fn::Base64": { "Fn::Join": [ "", [
						"<powershell>\n",
						"$size = (Get-PartitionSupportedSize -DiskNumber 4 -PartitionNumber 2)\n",
						"Resize-Partition -DiskNumber 4 -PartitionNumber 2 -Size $size.SizeMax\n",
						"$size = (Get-PartitionSupportedSize -DiskNumber 5 -PartitionNumber 2)\n",
						"Resize-Partition -DiskNumber 5 -PartitionNumber 2 -Size $size.SizeMax\n",
						"Rename-Computer -NewName ms238cpodsql260 -Restart\n",
						"</powershell>"
					]]}
				}
			}
		},
		"ms238cpodsql261": {
			"Type": "AWS::EC2::Instance",
			"Properties": {
				"AvailabilityZone": "us-east-1d",
				"IamInstanceProfile": "Sysco-ApplicationDefaultInstanceProfile-47RRMF15XFMP",
				"ImageId": "ami-1a659560",
				"InstanceType": "t2.large",
				"KeyName": { "Ref": "PemKey2" },
				"SecurityGroupIds": [{ "Ref": "CPDBSG" }, { "Ref": "NATCLIENT" }, "sg-42dc8b26"],
				"SubnetId": { "Ref": "Conf1d" },
				"BlockDeviceMappings": [
					{"DeviceName": "/dev/sda1", "Ebs": { "VolumeSize": "50", "VolumeType": "gp2" }},
					{"DeviceName": "xvdb", "Ebs": { "VolumeSize": "1", "VolumeType": "gp2" }},
					{"DeviceName": "xvdc", "Ebs": { "VolumeSize": "1", "VolumeType": "gp2" }},
					{"DeviceName": "xvdd", "Ebs": { "VolumeSize": "1", "VolumeType": "gp2" }},
					{"DeviceName": "xvde", "Ebs": { "VolumeSize": "100", "VolumeType": "gp2" }},
					{"DeviceName": "xvdf", "Ebs": { "VolumeSize": "100", "VolumeType": "gp2" }}
				],
				"Tags": [
				  { "Key" : "Name", "Value": "ms238cpodsql261" },
				  { "Key" : "Application_Id", "Value" : { "Ref": "ApplicationId" } },
				  { "Key" : "Application_Name", "Value" : { "Ref": "ApplicationName" } },
				  { "Key" : "Environment", "Value" :  { "Ref": "Environment" } },
				  { "Key" : "PO_Number", "Value" : { "Ref": "PONumber" } },
				  { "Key" : "Project_ID", "Value" : { "Ref": "ProjectId" } },
				  { "Key" : "Owner", "Value" : { "Ref": "Owner" } },
				  { "Key" : "Approver", "Value" : { "Ref": "Approver" } }
				],
				"UserData": {
					"Fn::Base64": { "Fn::Join": [ "", [
						"<powershell>\n",
						"$size = (Get-PartitionSupportedSize -DiskNumber 4 -PartitionNumber 2)\n",
						"Resize-Partition -DiskNumber 4 -PartitionNumber 2 -Size $size.SizeMax\n",
						"$size = (Get-PartitionSupportedSize -DiskNumber 5 -PartitionNumber 2)\n",
						"Resize-Partition -DiskNumber 5 -PartitionNumber 2 -Size $size.SizeMax\n",
						"Rename-Computer -NewName ms238cpodsql261 -Restart\n",
						"</powershell>"
					]]}
				}
			}
		},
		"ms238cpodsql262": {
			"Type": "AWS::EC2::Instance",
			"Properties": {
				"AvailabilityZone": "us-east-1c",
				"IamInstanceProfile": "Sysco-ApplicationDefaultInstanceProfile-47RRMF15XFMP",
				"ImageId": "ami-1a659560",
				"InstanceType": "t2.large",
				"KeyName": { "Ref": "PemKey2" },
				"SecurityGroupIds": [{ "Ref": "CPDBSG" }, { "Ref": "NATCLIENT" }, "sg-42dc8b26"],
				"SubnetId": { "Ref": "Conf1c" },
				"BlockDeviceMappings": [
					{"DeviceName": "/dev/sda1", "Ebs": { "VolumeSize": "50", "VolumeType": "gp2" }},
					{"DeviceName": "xvdb", "Ebs": { "VolumeSize": "1", "VolumeType": "gp2" }},
					{"DeviceName": "xvdc", "Ebs": { "VolumeSize": "1", "VolumeType": "gp2" }},
					{"DeviceName": "xvdd", "Ebs": { "VolumeSize": "1", "VolumeType": "gp2" }},
					{"DeviceName": "xvde", "Ebs": { "VolumeSize": "100", "VolumeType": "gp2" }},
					{"DeviceName": "xvdf", "Ebs": { "VolumeSize": "100", "VolumeType": "gp2" }}
				],
				"Tags": [
				  { "Key" : "Name", "Value": "ms238cpodsql262" },
				  { "Key" : "Application_Id", "Value" : { "Ref": "ApplicationId" } },
				  { "Key" : "Application_Name", "Value" : { "Ref": "ApplicationName" } },
				  { "Key" : "Environment", "Value" :  { "Ref": "Environment" } },
				  { "Key" : "PO_Number", "Value" : { "Ref": "PONumber" } },
				  { "Key" : "Project_ID", "Value" : { "Ref": "ProjectId" } },
				  { "Key" : "Owner", "Value" : { "Ref": "Owner" } },
				  { "Key" : "Approver", "Value" : { "Ref": "Approver" } }
				],
				"UserData": {
					"Fn::Base64": { "Fn::Join": [ "", [
						"<powershell>\n",
						"$size = (Get-PartitionSupportedSize -DiskNumber 4 -PartitionNumber 2)\n",
						"Resize-Partition -DiskNumber 4 -PartitionNumber 2 -Size $size.SizeMax\n",
						"$size = (Get-PartitionSupportedSize -DiskNumber 5 -PartitionNumber 2)\n",
						"Resize-Partition -DiskNumber 5 -PartitionNumber 2 -Size $size.SizeMax\n",
						"Rename-Computer -NewName ms238cpodsql262 -Restart\n",
						"</powershell>"
					]]}
				}
			}
		},
		"ms238cpodsql263": {
			"Type": "AWS::EC2::Instance",
			"Properties": {
				"AvailabilityZone": "us-east-1d",
				"IamInstanceProfile": "Sysco-ApplicationDefaultInstanceProfile-47RRMF15XFMP",
				"ImageId": "ami-1a659560",
				"InstanceType": "t2.large",
				"KeyName": { "Ref": "PemKey2" },
				"SecurityGroupIds": [{ "Ref": "CPDBSG" }, { "Ref": "NATCLIENT" }, "sg-42dc8b26"],
				"SubnetId": { "Ref": "Conf1d" },
				"BlockDeviceMappings": [
					{"DeviceName": "/dev/sda1", "Ebs": { "VolumeSize": "50", "VolumeType": "gp2" }},
					{"DeviceName": "xvdb", "Ebs": { "VolumeSize": "1", "VolumeType": "gp2" }},
					{"DeviceName": "xvdc", "Ebs": { "VolumeSize": "1", "VolumeType": "gp2" }},
					{"DeviceName": "xvdd", "Ebs": { "VolumeSize": "1", "VolumeType": "gp2" }},
					{"DeviceName": "xvde", "Ebs": { "VolumeSize": "100", "VolumeType": "gp2" }},
					{"DeviceName": "xvdf", "Ebs": { "VolumeSize": "100", "VolumeType": "gp2" }}
				],
				"Tags": [
				  { "Key" : "Name", "Value": "ms238cpodsql263" },
				  { "Key" : "Application_Id", "Value" : { "Ref": "ApplicationId" } },
				  { "Key" : "Application_Name", "Value" : { "Ref": "ApplicationName" } },
				  { "Key" : "Environment", "Value" :  { "Ref": "Environment" } },
				  { "Key" : "PO_Number", "Value" : { "Ref": "PONumber" } },
				  { "Key" : "Project_ID", "Value" : { "Ref": "ProjectId" } },
				  { "Key" : "Owner", "Value" : { "Ref": "Owner" } },
				  { "Key" : "Approver", "Value" : { "Ref": "Approver" } }
				],
				"UserData": {
					"Fn::Base64": { "Fn::Join": [ "", [
						"<powershell>\n",
						"$size = (Get-PartitionSupportedSize -DiskNumber 4 -PartitionNumber 2)\n",
						"Resize-Partition -DiskNumber 4 -PartitionNumber 2 -Size $size.SizeMax\n",
						"$size = (Get-PartitionSupportedSize -DiskNumber 5 -PartitionNumber 2)\n",
						"Resize-Partition -DiskNumber 5 -PartitionNumber 2 -Size $size.SizeMax\n",
						"Rename-Computer -NewName ms238cpodsql263 -Restart\n",
						"</powershell>"
					]]}
				}
			}
		},
		"ms238cpodsql264": {
			"Type": "AWS::EC2::Instance",
			"Properties": {
				"AvailabilityZone": "us-east-1c",
				"IamInstanceProfile": "Sysco-ApplicationDefaultInstanceProfile-47RRMF15XFMP",
				"ImageId": "ami-1a659560",
				"InstanceType": "t2.large",
				"KeyName": { "Ref": "PemKey2" },
				"SecurityGroupIds": [{ "Ref": "CPDBSG" }, { "Ref": "NATCLIENT" }, "sg-42dc8b26"],
				"SubnetId": { "Ref": "Conf1c" },
				"BlockDeviceMappings": [
					{"DeviceName": "/dev/sda1", "Ebs": { "VolumeSize": "50", "VolumeType": "gp2" }},
					{"DeviceName": "xvdb", "Ebs": { "VolumeSize": "1", "VolumeType": "gp2" }},
					{"DeviceName": "xvdc", "Ebs": { "VolumeSize": "1", "VolumeType": "gp2" }},
					{"DeviceName": "xvdd", "Ebs": { "VolumeSize": "1", "VolumeType": "gp2" }},
					{"DeviceName": "xvde", "Ebs": { "VolumeSize": "100", "VolumeType": "gp2" }},
					{"DeviceName": "xvdf", "Ebs": { "VolumeSize": "100", "VolumeType": "gp2" }}
				],
				"Tags": [
				  { "Key" : "Name", "Value": "ms238cpodsql264" },
				  { "Key" : "Application_Id", "Value" : { "Ref": "ApplicationId" } },
				  { "Key" : "Application_Name", "Value" : { "Ref": "ApplicationName" } },
				  { "Key" : "Environment", "Value" :  { "Ref": "Environment" } },
				  { "Key" : "PO_Number", "Value" : { "Ref": "PONumber" } },
				  { "Key" : "Project_ID", "Value" : { "Ref": "ProjectId" } },
				  { "Key" : "Owner", "Value" : { "Ref": "Owner" } },
				  { "Key" : "Approver", "Value" : { "Ref": "Approver" } }
				],
				"UserData": {
					"Fn::Base64": { "Fn::Join": [ "", [
						"<powershell>\n",
						"$size = (Get-PartitionSupportedSize -DiskNumber 4 -PartitionNumber 2)\n",
						"Resize-Partition -DiskNumber 4 -PartitionNumber 2 -Size $size.SizeMax\n",
						"$size = (Get-PartitionSupportedSize -DiskNumber 5 -PartitionNumber 2)\n",
						"Resize-Partition -DiskNumber 5 -PartitionNumber 2 -Size $size.SizeMax\n",
						"Rename-Computer -NewName ms238cpodsql264 -Restart\n",
						"</powershell>"
					]]}
				}
			}
		},
		"ms238cpodsql265": {
			"Type": "AWS::EC2::Instance",
			"Properties": {
				"AvailabilityZone": "us-east-1d",
				"IamInstanceProfile": "Sysco-ApplicationDefaultInstanceProfile-47RRMF15XFMP",
				"ImageId": "ami-1a659560",
				"InstanceType": "t2.large",
				"KeyName": { "Ref": "PemKey2" },
				"SecurityGroupIds": [{ "Ref": "CPDBSG" }, { "Ref": "NATCLIENT" }, "sg-42dc8b26"],
				"SubnetId": { "Ref": "Conf1d" },
				"BlockDeviceMappings": [
					{"DeviceName": "/dev/sda1", "Ebs": { "VolumeSize": "50", "VolumeType": "gp2" }},
					{"DeviceName": "xvdb", "Ebs": { "VolumeSize": "1", "VolumeType": "gp2" }},
					{"DeviceName": "xvdc", "Ebs": { "VolumeSize": "1", "VolumeType": "gp2" }},
					{"DeviceName": "xvdd", "Ebs": { "VolumeSize": "1", "VolumeType": "gp2" }},
					{"DeviceName": "xvde", "Ebs": { "VolumeSize": "100", "VolumeType": "gp2" }},
					{"DeviceName": "xvdf", "Ebs": { "VolumeSize": "100", "VolumeType": "gp2" }}
				],
				"Tags": [
				  { "Key" : "Name", "Value": "ms238cpodsql265" },
				  { "Key" : "Application_Id", "Value" : { "Ref": "ApplicationId" } },
				  { "Key" : "Application_Name", "Value" : { "Ref": "ApplicationName" } },
				  { "Key" : "Environment", "Value" :  { "Ref": "Environment" } },
				  { "Key" : "PO_Number", "Value" : { "Ref": "PONumber" } },
				  { "Key" : "Project_ID", "Value" : { "Ref": "ProjectId" } },
				  { "Key" : "Owner", "Value" : { "Ref": "Owner" } },
				  { "Key" : "Approver", "Value" : { "Ref": "Approver" } }
				],
				"UserData": {
					"Fn::Base64": { "Fn::Join": [ "", [
						"<powershell>\n",
						"$size = (Get-PartitionSupportedSize -DiskNumber 4 -PartitionNumber 2)\n",
						"Resize-Partition -DiskNumber 4 -PartitionNumber 2 -Size $size.SizeMax\n",
						"$size = (Get-PartitionSupportedSize -DiskNumber 5 -PartitionNumber 2)\n",
						"Resize-Partition -DiskNumber 5 -PartitionNumber 2 -Size $size.SizeMax\n",
						"Rename-Computer -NewName ms238cpodsql265 -Restart\n",
						"</powershell>"
					]]}
				}
			}
		},
		"ms238cpodsql266": {
			"Type": "AWS::EC2::Instance",
			"Properties": {
				"AvailabilityZone": "us-east-1c",
				"IamInstanceProfile": "Sysco-ApplicationDefaultInstanceProfile-47RRMF15XFMP",
				"ImageId": "ami-1a659560",
				"InstanceType": "t2.large",
				"KeyName": { "Ref": "PemKey2" },
				"SecurityGroupIds": [{ "Ref": "CPDBSG" }, { "Ref": "NATCLIENT" }, "sg-42dc8b26"],
				"SubnetId": { "Ref": "Conf1c" },
				"BlockDeviceMappings": [
					{"DeviceName": "/dev/sda1", "Ebs": { "VolumeSize": "50", "VolumeType": "gp2" }},
					{"DeviceName": "xvdb", "Ebs": { "VolumeSize": "1", "VolumeType": "gp2" }},
					{"DeviceName": "xvdc", "Ebs": { "VolumeSize": "1", "VolumeType": "gp2" }},
					{"DeviceName": "xvdd", "Ebs": { "VolumeSize": "1", "VolumeType": "gp2" }},
					{"DeviceName": "xvde", "Ebs": { "VolumeSize": "100", "VolumeType": "gp2" }},
					{"DeviceName": "xvdf", "Ebs": { "VolumeSize": "100", "VolumeType": "gp2" }}
				],
				"Tags": [
				  { "Key" : "Name", "Value": "ms238cpodsql266" },
				  { "Key" : "Application_Id", "Value" : { "Ref": "ApplicationId" } },
				  { "Key" : "Application_Name", "Value" : { "Ref": "ApplicationName" } },
				  { "Key" : "Environment", "Value" :  { "Ref": "Environment" } },
				  { "Key" : "PO_Number", "Value" : { "Ref": "PONumber" } },
				  { "Key" : "Project_ID", "Value" : { "Ref": "ProjectId" } },
				  { "Key" : "Owner", "Value" : { "Ref": "Owner" } },
				  { "Key" : "Approver", "Value" : { "Ref": "Approver" } }
				],
				"UserData": {
					"Fn::Base64": { "Fn::Join": [ "", [
						"<powershell>\n",
						"$size = (Get-PartitionSupportedSize -DiskNumber 4 -PartitionNumber 2)\n",
						"Resize-Partition -DiskNumber 4 -PartitionNumber 2 -Size $size.SizeMax\n",
						"$size = (Get-PartitionSupportedSize -DiskNumber 5 -PartitionNumber 2)\n",
						"Resize-Partition -DiskNumber 5 -PartitionNumber 2 -Size $size.SizeMax\n",
						"Rename-Computer -NewName ms238cpodsql266 -Restart\n",
						"</powershell>"
					]]}
				}
			}
		},
		"ms238cpodsql267": {
			"Type": "AWS::EC2::Instance",
			"Properties": {
				"AvailabilityZone": "us-east-1d",
				"IamInstanceProfile": "Sysco-ApplicationDefaultInstanceProfile-47RRMF15XFMP",
				"ImageId": "ami-1a659560",
				"InstanceType": "t2.large",
				"KeyName": { "Ref": "PemKey2" },
				"SecurityGroupIds": [{ "Ref": "CPDBSG" }, { "Ref": "NATCLIENT" }, "sg-42dc8b26"],
				"SubnetId": { "Ref": "Conf1d" },
				"BlockDeviceMappings": [
					{"DeviceName": "/dev/sda1", "Ebs": { "VolumeSize": "50", "VolumeType": "gp2" }},
					{"DeviceName": "xvdb", "Ebs": { "VolumeSize": "1", "VolumeType": "gp2" }},
					{"DeviceName": "xvdc", "Ebs": { "VolumeSize": "1", "VolumeType": "gp2" }},
					{"DeviceName": "xvdd", "Ebs": { "VolumeSize": "1", "VolumeType": "gp2" }},
					{"DeviceName": "xvde", "Ebs": { "VolumeSize": "100", "VolumeType": "gp2" }},
					{"DeviceName": "xvdf", "Ebs": { "VolumeSize": "100", "VolumeType": "gp2" }}
				],
				"Tags": [
				  { "Key" : "Name", "Value": "ms238cpodsql267" },
				  { "Key" : "Application_Id", "Value" : { "Ref": "ApplicationId" } },
				  { "Key" : "Application_Name", "Value" : { "Ref": "ApplicationName" } },
				  { "Key" : "Environment", "Value" :  { "Ref": "Environment" } },
				  { "Key" : "PO_Number", "Value" : { "Ref": "PONumber" } },
				  { "Key" : "Project_ID", "Value" : { "Ref": "ProjectId" } },
				  { "Key" : "Owner", "Value" : { "Ref": "Owner" } },
				  { "Key" : "Approver", "Value" : { "Ref": "Approver" } }
				],
				"UserData": {
					"Fn::Base64": { "Fn::Join": [ "", [
						"<powershell>\n",
						"$size = (Get-PartitionSupportedSize -DiskNumber 4 -PartitionNumber 2)\n",
						"Resize-Partition -DiskNumber 4 -PartitionNumber 2 -Size $size.SizeMax\n",
						"$size = (Get-PartitionSupportedSize -DiskNumber 5 -PartitionNumber 2)\n",
						"Resize-Partition -DiskNumber 5 -PartitionNumber 2 -Size $size.SizeMax\n",
						"Rename-Computer -NewName ms238cpodsql267 -Restart\n",
						"</powershell>"
					]]}
				}
			}
		},
		"ms238cpodsql268": {
			"Type": "AWS::EC2::Instance",
			"Properties": {
				"AvailabilityZone": "us-east-1c",
				"IamInstanceProfile": "Sysco-ApplicationDefaultInstanceProfile-47RRMF15XFMP",
				"ImageId": "ami-1a659560",
				"InstanceType": "t2.large",
				"KeyName": { "Ref": "PemKey2" },
				"SecurityGroupIds": [{ "Ref": "CPDBSG" }, { "Ref": "NATCLIENT" }, "sg-42dc8b26"],
				"SubnetId": { "Ref": "Conf1c" },
				"BlockDeviceMappings": [
					{"DeviceName": "/dev/sda1", "Ebs": { "VolumeSize": "50", "VolumeType": "gp2" }},
					{"DeviceName": "xvdb", "Ebs": { "VolumeSize": "1", "VolumeType": "gp2" }},
					{"DeviceName": "xvdc", "Ebs": { "VolumeSize": "1", "VolumeType": "gp2" }},
					{"DeviceName": "xvdd", "Ebs": { "VolumeSize": "1", "VolumeType": "gp2" }},
					{"DeviceName": "xvde", "Ebs": { "VolumeSize": "100", "VolumeType": "gp2" }},
					{"DeviceName": "xvdf", "Ebs": { "VolumeSize": "100", "VolumeType": "gp2" }}
				],
				"Tags": [
				  { "Key" : "Name", "Value": "ms238cpodsql268" },
				  { "Key" : "Application_Id", "Value" : { "Ref": "ApplicationId" } },
				  { "Key" : "Application_Name", "Value" : { "Ref": "ApplicationName" } },
				  { "Key" : "Environment", "Value" :  { "Ref": "Environment" } },
				  { "Key" : "PO_Number", "Value" : { "Ref": "PONumber" } },
				  { "Key" : "Project_ID", "Value" : { "Ref": "ProjectId" } },
				  { "Key" : "Owner", "Value" : { "Ref": "Owner" } },
				  { "Key" : "Approver", "Value" : { "Ref": "Approver" } }
				],
				"UserData": {
					"Fn::Base64": { "Fn::Join": [ "", [
						"<powershell>\n",
						"$size = (Get-PartitionSupportedSize -DiskNumber 4 -PartitionNumber 2)\n",
						"Resize-Partition -DiskNumber 4 -PartitionNumber 2 -Size $size.SizeMax\n",
						"$size = (Get-PartitionSupportedSize -DiskNumber 5 -PartitionNumber 2)\n",
						"Resize-Partition -DiskNumber 5 -PartitionNumber 2 -Size $size.SizeMax\n",
						"Rename-Computer -NewName ms238cpodsql268 -Restart\n",
						"</powershell>"
					]]}
				}
			}
		},
		"ms238cpodsql269": {
			"Type": "AWS::EC2::Instance",
			"Properties": {
				"AvailabilityZone": "us-east-1d",
				"IamInstanceProfile": "Sysco-ApplicationDefaultInstanceProfile-47RRMF15XFMP",
				"ImageId": "ami-1a659560",
				"InstanceType": "t2.large",
				"KeyName": { "Ref": "PemKey2" },
				"SecurityGroupIds": [{ "Ref": "CPDBSG" }, { "Ref": "NATCLIENT" }, "sg-42dc8b26"],
				"SubnetId": { "Ref": "Conf1d" },
				"BlockDeviceMappings": [
					{"DeviceName": "/dev/sda1", "Ebs": { "VolumeSize": "50", "VolumeType": "gp2" }},
					{"DeviceName": "xvdb", "Ebs": { "VolumeSize": "1", "VolumeType": "gp2" }},
					{"DeviceName": "xvdc", "Ebs": { "VolumeSize": "1", "VolumeType": "gp2" }},
					{"DeviceName": "xvdd", "Ebs": { "VolumeSize": "1", "VolumeType": "gp2" }},
					{"DeviceName": "xvde", "Ebs": { "VolumeSize": "100", "VolumeType": "gp2" }},
					{"DeviceName": "xvdf", "Ebs": { "VolumeSize": "100", "VolumeType": "gp2" }}
				],
				"Tags": [
				  { "Key" : "Name", "Value": "ms238cpodsql269" },
				  { "Key" : "Application_Id", "Value" : { "Ref": "ApplicationId" } },
				  { "Key" : "Application_Name", "Value" : { "Ref": "ApplicationName" } },
				  { "Key" : "Environment", "Value" :  { "Ref": "Environment" } },
				  { "Key" : "PO_Number", "Value" : { "Ref": "PONumber" } },
				  { "Key" : "Project_ID", "Value" : { "Ref": "ProjectId" } },
				  { "Key" : "Owner", "Value" : { "Ref": "Owner" } },
				  { "Key" : "Approver", "Value" : { "Ref": "Approver" } }
				],
				"UserData": {
					"Fn::Base64": { "Fn::Join": [ "", [
						"<powershell>\n",
						"$size = (Get-PartitionSupportedSize -DiskNumber 4 -PartitionNumber 2)\n",
						"Resize-Partition -DiskNumber 4 -PartitionNumber 2 -Size $size.SizeMax\n",
						"$size = (Get-PartitionSupportedSize -DiskNumber 5 -PartitionNumber 2)\n",
						"Resize-Partition -DiskNumber 5 -PartitionNumber 2 -Size $size.SizeMax\n",
						"Rename-Computer -NewName ms238cpodsql269 -Restart\n",
						"</powershell>"
					]]}
				}
			}
		},
		"ms238cpodsql270": {
			"Type": "AWS::EC2::Instance",
			"Properties": {
				"AvailabilityZone": "us-east-1c",
				"IamInstanceProfile": "Sysco-ApplicationDefaultInstanceProfile-47RRMF15XFMP",
				"ImageId": "ami-1a659560",
				"InstanceType": "t2.large",
				"KeyName": { "Ref": "PemKey2" },
				"SecurityGroupIds": [{ "Ref": "CPDBSG" }, { "Ref": "NATCLIENT" }, "sg-42dc8b26"],
				"SubnetId": { "Ref": "Conf1c" },
				"BlockDeviceMappings": [
					{"DeviceName": "/dev/sda1", "Ebs": { "VolumeSize": "50", "VolumeType": "gp2" }},
					{"DeviceName": "xvdb", "Ebs": { "VolumeSize": "1", "VolumeType": "gp2" }},
					{"DeviceName": "xvdc", "Ebs": { "VolumeSize": "1", "VolumeType": "gp2" }},
					{"DeviceName": "xvdd", "Ebs": { "VolumeSize": "1", "VolumeType": "gp2" }},
					{"DeviceName": "xvde", "Ebs": { "VolumeSize": "100", "VolumeType": "gp2" }},
					{"DeviceName": "xvdf", "Ebs": { "VolumeSize": "100", "VolumeType": "gp2" }}
				],
				"Tags": [
				  { "Key" : "Name", "Value": "ms238cpodsql270" },
				  { "Key" : "Application_Id", "Value" : { "Ref": "ApplicationId" } },
				  { "Key" : "Application_Name", "Value" : { "Ref": "ApplicationName" } },
				  { "Key" : "Environment", "Value" :  { "Ref": "Environment" } },
				  { "Key" : "PO_Number", "Value" : { "Ref": "PONumber" } },
				  { "Key" : "Project_ID", "Value" : { "Ref": "ProjectId" } },
				  { "Key" : "Owner", "Value" : { "Ref": "Owner" } },
				  { "Key" : "Approver", "Value" : { "Ref": "Approver" } }
				],
				"UserData": {
					"Fn::Base64": { "Fn::Join": [ "", [
						"<powershell>\n",
						"$size = (Get-PartitionSupportedSize -DiskNumber 4 -PartitionNumber 2)\n",
						"Resize-Partition -DiskNumber 4 -PartitionNumber 2 -Size $size.SizeMax\n",
						"$size = (Get-PartitionSupportedSize -DiskNumber 5 -PartitionNumber 2)\n",
						"Resize-Partition -DiskNumber 5 -PartitionNumber 2 -Size $size.SizeMax\n",
						"Rename-Computer -NewName ms238cpodsql270 -Restart\n",
						"</powershell>"
					]]}
				}
			}
		},
		"ms238cpodsql271": {
			"Type": "AWS::EC2::Instance",
			"Properties": {
				"AvailabilityZone": "us-east-1d",
				"IamInstanceProfile": "Sysco-ApplicationDefaultInstanceProfile-47RRMF15XFMP",
				"ImageId": "ami-1a659560",
				"InstanceType": "t2.large",
				"KeyName": { "Ref": "PemKey2" },
				"SecurityGroupIds": [{ "Ref": "CPDBSG" }, { "Ref": "NATCLIENT" }, "sg-42dc8b26"],
				"SubnetId": { "Ref": "Conf1d" },
				"BlockDeviceMappings": [
					{"DeviceName": "/dev/sda1", "Ebs": { "VolumeSize": "50", "VolumeType": "gp2" }},
					{"DeviceName": "xvdb", "Ebs": { "VolumeSize": "1", "VolumeType": "gp2" }},
					{"DeviceName": "xvdc", "Ebs": { "VolumeSize": "1", "VolumeType": "gp2" }},
					{"DeviceName": "xvdd", "Ebs": { "VolumeSize": "1", "VolumeType": "gp2" }},
					{"DeviceName": "xvde", "Ebs": { "VolumeSize": "100", "VolumeType": "gp2" }},
					{"DeviceName": "xvdf", "Ebs": { "VolumeSize": "100", "VolumeType": "gp2" }}
				],
				"Tags": [
				  { "Key" : "Name", "Value": "ms238cpodsql271" },
				  { "Key" : "Application_Id", "Value" : { "Ref": "ApplicationId" } },
				  { "Key" : "Application_Name", "Value" : { "Ref": "ApplicationName" } },
				  { "Key" : "Environment", "Value" :  { "Ref": "Environment" } },
				  { "Key" : "PO_Number", "Value" : { "Ref": "PONumber" } },
				  { "Key" : "Project_ID", "Value" : { "Ref": "ProjectId" } },
				  { "Key" : "Owner", "Value" : { "Ref": "Owner" } },
				  { "Key" : "Approver", "Value" : { "Ref": "Approver" } }
				],
				"UserData": {
					"Fn::Base64": { "Fn::Join": [ "", [
						"<powershell>\n",
						"$size = (Get-PartitionSupportedSize -DiskNumber 4 -PartitionNumber 2)\n",
						"Resize-Partition -DiskNumber 4 -PartitionNumber 2 -Size $size.SizeMax\n",
						"$size = (Get-PartitionSupportedSize -DiskNumber 5 -PartitionNumber 2)\n",
						"Resize-Partition -DiskNumber 5 -PartitionNumber 2 -Size $size.SizeMax\n",
						"Rename-Computer -NewName ms238cpodsql271 -Restart\n",
						"</powershell>"
					]]}
				}
			}
		},
		"ms238cpodsql272": {
			"Type": "AWS::EC2::Instance",
			"Properties": {
				"AvailabilityZone": "us-east-1c",
				"IamInstanceProfile": "Sysco-ApplicationDefaultInstanceProfile-47RRMF15XFMP",
				"ImageId": "ami-1a659560",
				"InstanceType": "t2.large",
				"KeyName": { "Ref": "PemKey2" },
				"SecurityGroupIds": [{ "Ref": "CPDBSG" }, { "Ref": "NATCLIENT" }, "sg-42dc8b26"],
				"SubnetId": { "Ref": "Conf1c" },
				"BlockDeviceMappings": [
					{"DeviceName": "/dev/sda1", "Ebs": { "VolumeSize": "50", "VolumeType": "gp2" }},
					{"DeviceName": "xvdb", "Ebs": { "VolumeSize": "1", "VolumeType": "gp2" }},
					{"DeviceName": "xvdc", "Ebs": { "VolumeSize": "1", "VolumeType": "gp2" }},
					{"DeviceName": "xvdd", "Ebs": { "VolumeSize": "1", "VolumeType": "gp2" }},
					{"DeviceName": "xvde", "Ebs": { "VolumeSize": "100", "VolumeType": "gp2" }},
					{"DeviceName": "xvdf", "Ebs": { "VolumeSize": "100", "VolumeType": "gp2" }}
				],
				"Tags": [
				  { "Key" : "Name", "Value": "ms238cpodsql272" },
				  { "Key" : "Application_Id", "Value" : { "Ref": "ApplicationId" } },
				  { "Key" : "Application_Name", "Value" : { "Ref": "ApplicationName" } },
				  { "Key" : "Environment", "Value" :  { "Ref": "Environment" } },
				  { "Key" : "PO_Number", "Value" : { "Ref": "PONumber" } },
				  { "Key" : "Project_ID", "Value" : { "Ref": "ProjectId" } },
				  { "Key" : "Owner", "Value" : { "Ref": "Owner" } },
				  { "Key" : "Approver", "Value" : { "Ref": "Approver" } }
				],
				"UserData": {
					"Fn::Base64": { "Fn::Join": [ "", [
						"<powershell>\n",
						"$size = (Get-PartitionSupportedSize -DiskNumber 4 -PartitionNumber 2)\n",
						"Resize-Partition -DiskNumber 4 -PartitionNumber 2 -Size $size.SizeMax\n",
						"$size = (Get-PartitionSupportedSize -DiskNumber 5 -PartitionNumber 2)\n",
						"Resize-Partition -DiskNumber 5 -PartitionNumber 2 -Size $size.SizeMax\n",
						"Rename-Computer -NewName ms238cpodsql272 -Restart\n",
						"</powershell>"
					]]}
				}
			}
		},
		"ms238cpodsql273": {
			"Type": "AWS::EC2::Instance",
			"Properties": {
				"AvailabilityZone": "us-east-1d",
				"IamInstanceProfile": "Sysco-ApplicationDefaultInstanceProfile-47RRMF15XFMP",
				"ImageId": "ami-1a659560",
				"InstanceType": "t2.large",
				"KeyName": { "Ref": "PemKey2" },
				"SecurityGroupIds": [{ "Ref": "CPDBSG" }, { "Ref": "NATCLIENT" }, "sg-42dc8b26"],
				"SubnetId": { "Ref": "Conf1d" },
				"BlockDeviceMappings": [
					{"DeviceName": "/dev/sda1", "Ebs": { "VolumeSize": "50", "VolumeType": "gp2" }},
					{"DeviceName": "xvdb", "Ebs": { "VolumeSize": "1", "VolumeType": "gp2" }},
					{"DeviceName": "xvdc", "Ebs": { "VolumeSize": "1", "VolumeType": "gp2" }},
					{"DeviceName": "xvdd", "Ebs": { "VolumeSize": "1", "VolumeType": "gp2" }},
					{"DeviceName": "xvde", "Ebs": { "VolumeSize": "100", "VolumeType": "gp2" }},
					{"DeviceName": "xvdf", "Ebs": { "VolumeSize": "100", "VolumeType": "gp2" }}
				],
				"Tags": [
				  { "Key" : "Name", "Value": "ms238cpodsql273" },
				  { "Key" : "Application_Id", "Value" : { "Ref": "ApplicationId" } },
				  { "Key" : "Application_Name", "Value" : { "Ref": "ApplicationName" } },
				  { "Key" : "Environment", "Value" :  { "Ref": "Environment" } },
				  { "Key" : "PO_Number", "Value" : { "Ref": "PONumber" } },
				  { "Key" : "Project_ID", "Value" : { "Ref": "ProjectId" } },
				  { "Key" : "Owner", "Value" : { "Ref": "Owner" } },
				  { "Key" : "Approver", "Value" : { "Ref": "Approver" } }
				],
				"UserData": {
					"Fn::Base64": { "Fn::Join": [ "", [
						"<powershell>\n",
						"$size = (Get-PartitionSupportedSize -DiskNumber 4 -PartitionNumber 2)\n",
						"Resize-Partition -DiskNumber 4 -PartitionNumber 2 -Size $size.SizeMax\n",
						"$size = (Get-PartitionSupportedSize -DiskNumber 5 -PartitionNumber 2)\n",
						"Resize-Partition -DiskNumber 5 -PartitionNumber 2 -Size $size.SizeMax\n",
						"Rename-Computer -NewName ms238cpodsql273 -Restart\n",
						"</powershell>"
					]]}
				}
			}
		},
		"ms238cpodsql274": {
			"Type": "AWS::EC2::Instance",
			"Properties": {
				"AvailabilityZone": "us-east-1c",
				"IamInstanceProfile": "Sysco-ApplicationDefaultInstanceProfile-47RRMF15XFMP",
				"ImageId": "ami-1a659560",
				"InstanceType": "t2.large",
				"KeyName": { "Ref": "PemKey2" },
				"SecurityGroupIds": [{ "Ref": "CPDBSG" }, { "Ref": "NATCLIENT" }, "sg-42dc8b26"],
				"SubnetId": { "Ref": "Conf1c" },
				"BlockDeviceMappings": [
					{"DeviceName": "/dev/sda1", "Ebs": { "VolumeSize": "50", "VolumeType": "gp2" }},
					{"DeviceName": "xvdb", "Ebs": { "VolumeSize": "1", "VolumeType": "gp2" }},
					{"DeviceName": "xvdc", "Ebs": { "VolumeSize": "1", "VolumeType": "gp2" }},
					{"DeviceName": "xvdd", "Ebs": { "VolumeSize": "1", "VolumeType": "gp2" }},
					{"DeviceName": "xvde", "Ebs": { "VolumeSize": "100", "VolumeType": "gp2" }},
					{"DeviceName": "xvdf", "Ebs": { "VolumeSize": "100", "VolumeType": "gp2" }}
				],
				"Tags": [
				  { "Key" : "Name", "Value": "ms238cpodsql274" },
				  { "Key" : "Application_Id", "Value" : { "Ref": "ApplicationId" } },
				  { "Key" : "Application_Name", "Value" : { "Ref": "ApplicationName" } },
				  { "Key" : "Environment", "Value" :  { "Ref": "Environment" } },
				  { "Key" : "PO_Number", "Value" : { "Ref": "PONumber" } },
				  { "Key" : "Project_ID", "Value" : { "Ref": "ProjectId" } },
				  { "Key" : "Owner", "Value" : { "Ref": "Owner" } },
				  { "Key" : "Approver", "Value" : { "Ref": "Approver" } }
				],
				"UserData": {
					"Fn::Base64": { "Fn::Join": [ "", [
						"<powershell>\n",
						"$size = (Get-PartitionSupportedSize -DiskNumber 4 -PartitionNumber 2)\n",
						"Resize-Partition -DiskNumber 4 -PartitionNumber 2 -Size $size.SizeMax\n",
						"$size = (Get-PartitionSupportedSize -DiskNumber 5 -PartitionNumber 2)\n",
						"Resize-Partition -DiskNumber 5 -PartitionNumber 2 -Size $size.SizeMax\n",
						"Rename-Computer -NewName ms238cpodsql274 -Restart\n",
						"</powershell>"
					]]}
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
					"FromPort" : "3181",
					"ToPort" : "3181",
					"CidrIp" : "10.0.0.0/8"
				},
				{
					"IpProtocol" : "tcp",
					"FromPort" : "1433",
					"ToPort" : "1433",
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
					{ "Key" : "Name", "Value" : "sg/vpc_sysco_prod_01/cpdbod_prod_app" },
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
		"CPWEBSG": {
			"Type": "AWS::EC2::SecurityGroup",
			"Properties": {
				"GroupDescription": "Web Services",
				"VpcId": {
					"Ref": "VPCID"
				},
				"SecurityGroupIngress": [{
					"IpProtocol": "tcp",
					"FromPort": "80",
					"ToPort": "80",
					"CidrIp": "10.0.0.0/8"
				}, {
					"IpProtocol": "tcp",
					"FromPort": "3389",
					"ToPort": "3389",
					"CidrIp": "10.0.0.0/8"
				}, {
					"IpProtocol": "tcp",
					"FromPort": "443",
					"ToPort": "443",
					"CidrIp": "10.0.0.0/8"
				}],
				"Tags": [
				  { "Key" : "Name", "Value": "sg/vpc_sysco_prod_01/cp_web" },
				  { "Key" : "Application_Id", "Value" : { "Ref": "ApplicationId" } },
				  { "Key" : "Application_Name", "Value" : { "Ref": "ApplicationName" } },
				  { "Key" : "Environment", "Value" :  { "Ref": "Environment" } },
				  { "Key" : "PO_Number", "Value" : { "Ref": "PONumber" } },
				  { "Key" : "Project_ID", "Value" : { "Ref": "ProjectId" } },
				  { "Key" : "Owner", "Value" : { "Ref": "Owner" } },
				  { "Key" : "Approver", "Value" : { "Ref": "Approver" } }
				]
			}
		},
		"IngressAdder": {
			"DependsOn": "CPWEBSG",
			"Type": "AWS::EC2::SecurityGroupIngress",
			"Properties": {
				"FromPort": "-1",
				"GroupId": {
					"Ref": "CPWEBSG"
				},
				"IpProtocol": "-1",
				"SourceSecurityGroupId": {
					"Ref": "CPWEBSG"
				},
				"ToPort": "-1"
			}
		},
		"CPDBSG": {
			"Type": "AWS::EC2::SecurityGroup",
			"Properties": {
				"GroupDescription": "Database Services",
				"VpcId": {
					"Ref": "VPCID"
				},
				"SecurityGroupIngress": [{
					"IpProtocol": "-1",
					"FromPort": "-1",
					"ToPort": "-1",
					"SourceSecurityGroupId": {
						"Ref": "CPWEBSG"
					}
				}, {
					"IpProtocol": "tcp",
					"FromPort": "3389",
					"ToPort": "3389",
					"CidrIp": "10.0.0.0/8"
				}, {
					"IpProtocol": "icmp",
					"FromPort": "-1",
					"ToPort": "-1",
					"CidrIp": "10.0.0.0/8"
				}, {
					"IpProtocol": "tcp",
					"FromPort": "3181",
					"ToPort": "3181",
					"CidrIp": "10.0.0.0/8"
				}, {
					"IpProtocol": "tcp",
					"FromPort": "1433",
					"ToPort": "1433",
					"CidrIp": "10.0.0.0/8"
				}],
				"Tags": [
				  { "Key" : "Name", "Value": "sg/vpc_sysco_prod_01/cp_db" },
				  { "Key" : "Application_Id", "Value" : { "Ref": "ApplicationId" } },
				  { "Key" : "Application_Name", "Value" : { "Ref": "ApplicationName" } },
				  { "Key" : "Environment", "Value" :  { "Ref": "Environment" } },
				  { "Key" : "PO_Number", "Value" : { "Ref": "PONumber" } },
				  { "Key" : "Project_ID", "Value" : { "Ref": "ProjectId" } },
				  { "Key" : "Owner", "Value" : { "Ref": "Owner" } },
				  { "Key" : "Approver", "Value" : { "Ref": "Approver" } }
				]
			}
		},
		"IngressAdder2": {
			"DependsOn": "CPDBSG",
			"Type": "AWS::EC2::SecurityGroupIngress",
			"Properties": {
				"FromPort": "-1",
				"GroupId": {
					"Ref": "CPDBSG"
				},
				"IpProtocol": "-1",
				"SourceSecurityGroupId": {
					"Ref": "CPDBSG"
				},
				"ToPort": "-1"
			}
		}
	}
}