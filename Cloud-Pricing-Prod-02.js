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
				"InstanceType": "r4.xlarge",
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
				"InstanceType": "r4.xlarge",
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
				"InstanceType": "r4.xlarge",
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
				"InstanceType": "r4.xlarge",
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
				"InstanceType": "r4.xlarge",
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
				"InstanceType": "r4.xlarge",
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
				"InstanceType": "r4.xlarge",
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
				"InstanceType": "r4.xlarge",
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
		"ms238cpodsql009": {
			"Type": "AWS::EC2::Instance",
			"Properties": {
				"AvailabilityZone": "us-east-1c",
				"IamInstanceProfile": "Sysco-ApplicationDefaultInstanceProfile-47RRMF15XFMP",
				"ImageId": { "Ref": "CPOD010AMI" },
				"InstanceType": "r4.xlarge",
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
				  { "Key" : "Name", "Value": "ms238cpodsql009" },
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
						"Rename-Computer -NewName ms238cpodsql009 -Restart\n",
						"</powershell>"
					]]}
				}
			}
		},
		"ms238cpodsql010": {
			"Type": "AWS::EC2::Instance",
			"Properties": {
				"AvailabilityZone": "us-east-1d",
				"IamInstanceProfile": "Sysco-ApplicationDefaultInstanceProfile-47RRMF15XFMP",
				"ImageId": { "Ref": "CPOD010AMI" },
				"InstanceType": "r4.xlarge",
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
				  { "Key" : "Name", "Value": "ms238cpodsql010" },
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
						"Rename-Computer -NewName ms238cpodsql010 -Restart\n",
						"</powershell>"
					]]}
				}
			}
		},
		"ms238cpodsql011": {
			"Type": "AWS::EC2::Instance",
			"Properties": {
				"AvailabilityZone": "us-east-1c",
				"IamInstanceProfile": "Sysco-ApplicationDefaultInstanceProfile-47RRMF15XFMP",
				"ImageId": { "Ref": "CPOD010AMI" },
				"InstanceType": "r4.xlarge",
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
				  { "Key" : "Name", "Value": "ms238cpodsql011" },
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
						"Rename-Computer -NewName ms238cpodsql011 -Restart\n",
						"</powershell>"
					]]}
				}
			}
		},
		"ms238cpodsql012": {
			"Type": "AWS::EC2::Instance",
			"Properties": {
				"AvailabilityZone": "us-east-1d",
				"IamInstanceProfile": "Sysco-ApplicationDefaultInstanceProfile-47RRMF15XFMP",
				"ImageId": { "Ref": "CPOD010AMI" },
				"InstanceType": "r4.xlarge",
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
				  { "Key" : "Name", "Value": "ms238cpodsql012" },
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
						"Rename-Computer -NewName ms238cpodsql012 -Restart\n",
						"</powershell>"
					]]}
				}
			}
		},
		"ms238cpodsql013": {
			"Type": "AWS::EC2::Instance",
			"Properties": {
				"AvailabilityZone": "us-east-1c",
				"IamInstanceProfile": "Sysco-ApplicationDefaultInstanceProfile-47RRMF15XFMP",
				"ImageId": { "Ref": "CPOD010AMI" },
				"InstanceType": "r4.xlarge",
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
				  { "Key" : "Name", "Value": "ms238cpodsql013" },
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
						"Rename-Computer -NewName ms238cpodsql013 -Restart\n",
						"</powershell>"
					]]}
				}
			}
		},
		"ms238cpodsql014": {
			"Type": "AWS::EC2::Instance",
			"Properties": {
				"AvailabilityZone": "us-east-1d",
				"IamInstanceProfile": "Sysco-ApplicationDefaultInstanceProfile-47RRMF15XFMP",
				"ImageId": { "Ref": "CPOD010AMI" },
				"InstanceType": "r4.xlarge",
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
				  { "Key" : "Name", "Value": "ms238cpodsql014" },
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
						"Rename-Computer -NewName ms238cpodsql014 -Restart\n",
						"</powershell>"
					]]}
				}
			}
		},
		"ms238cpodsql015": {
			"Type": "AWS::EC2::Instance",
			"Properties": {
				"AvailabilityZone": "us-east-1c",
				"IamInstanceProfile": "Sysco-ApplicationDefaultInstanceProfile-47RRMF15XFMP",
				"ImageId": { "Ref": "CPOD010AMI" },
				"InstanceType": "r4.xlarge",
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
				  { "Key" : "Name", "Value": "ms238cpodsql015" },
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
						"Rename-Computer -NewName ms238cpodsql015 -Restart\n",
						"</powershell>"
					]]}
				}
			}
		},
		"ms238cpodsql016": {
			"Type": "AWS::EC2::Instance",
			"Properties": {
				"AvailabilityZone": "us-east-1d",
				"IamInstanceProfile": "Sysco-ApplicationDefaultInstanceProfile-47RRMF15XFMP",
				"ImageId": { "Ref": "CPOD010AMI" },
				"InstanceType": "r4.xlarge",
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
				  { "Key" : "Name", "Value": "ms238cpodsql016" },
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
						"Rename-Computer -NewName ms238cpodsql016 -Restart\n",
						"</powershell>"
					]]}
				}
			}
		},
		"ms238cpodsql017": {
			"Type": "AWS::EC2::Instance",
			"Properties": {
				"AvailabilityZone": "us-east-1c",
				"IamInstanceProfile": "Sysco-ApplicationDefaultInstanceProfile-47RRMF15XFMP",
				"ImageId": { "Ref": "CPOD010AMI" },
				"InstanceType": "r4.xlarge",
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
				  { "Key" : "Name", "Value": "ms238cpodsql017" },
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
						"Rename-Computer -NewName ms238cpodsql017 -Restart\n",
						"</powershell>"
					]]}
				}
			}
		},
		"ms238cpodsql018": {
			"Type": "AWS::EC2::Instance",
			"Properties": {
				"AvailabilityZone": "us-east-1d",
				"IamInstanceProfile": "Sysco-ApplicationDefaultInstanceProfile-47RRMF15XFMP",
				"ImageId": { "Ref": "CPOD010AMI" },
				"InstanceType": "r4.xlarge",
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
				  { "Key" : "Name", "Value": "ms238cpodsql018" },
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
						"Rename-Computer -NewName ms238cpodsql018 -Restart\n",
						"</powershell>"
					]]}
				}
			}
		},
		"ms238cpodsql019": {
			"Type": "AWS::EC2::Instance",
			"Properties": {
				"AvailabilityZone": "us-east-1c",
				"IamInstanceProfile": "Sysco-ApplicationDefaultInstanceProfile-47RRMF15XFMP",
				"ImageId": { "Ref": "CPOD010AMI" },
				"InstanceType": "r4.xlarge",
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
				  { "Key" : "Name", "Value": "ms238cpodsql019" },
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
						"Rename-Computer -NewName ms238cpodsql019 -Restart\n",
						"</powershell>"
					]]}
				}
			}
		},
		"ms238cpodsql020": {
			"Type": "AWS::EC2::Instance",
			"Properties": {
				"AvailabilityZone": "us-east-1d",
				"IamInstanceProfile": "Sysco-ApplicationDefaultInstanceProfile-47RRMF15XFMP",
				"ImageId": { "Ref": "CPOD010AMI" },
				"InstanceType": "r4.xlarge",
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
				  { "Key" : "Name", "Value": "ms238cpodsql020" },
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
						"Rename-Computer -NewName ms238cpodsql020 -Restart\n",
						"</powershell>"
					]]}
				}
			}
		},
		"ms238cpodsql021": {
			"Type": "AWS::EC2::Instance",
			"Properties": {
				"AvailabilityZone": "us-east-1c",
				"IamInstanceProfile": "Sysco-ApplicationDefaultInstanceProfile-47RRMF15XFMP",
				"ImageId": { "Ref": "CPOD010AMI" },
				"InstanceType": "r4.xlarge",
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
				  { "Key" : "Name", "Value": "ms238cpodsql021" },
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
						"Rename-Computer -NewName ms238cpodsql021 -Restart\n",
						"</powershell>"
					]]}
				}
			}
		},
		"ms238cpodsql022": {
			"Type": "AWS::EC2::Instance",
			"Properties": {
				"AvailabilityZone": "us-east-1d",
				"IamInstanceProfile": "Sysco-ApplicationDefaultInstanceProfile-47RRMF15XFMP",
				"ImageId": { "Ref": "CPOD010AMI" },
				"InstanceType": "r4.xlarge",
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
				  { "Key" : "Name", "Value": "ms238cpodsql022" },
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
						"Rename-Computer -NewName ms238cpodsql022 -Restart\n",
						"</powershell>"
					]]}
				}
			}
		},
		"ms238cpodsql023": {
			"Type": "AWS::EC2::Instance",
			"Properties": {
				"AvailabilityZone": "us-east-1c",
				"IamInstanceProfile": "Sysco-ApplicationDefaultInstanceProfile-47RRMF15XFMP",
				"ImageId": { "Ref": "CPOD010AMI" },
				"InstanceType": "r4.xlarge",
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
				  { "Key" : "Name", "Value": "ms238cpodsql023" },
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
						"Rename-Computer -NewName ms238cpodsql023 -Restart\n",
						"</powershell>"
					]]}
				}
			}
		},
		"ms238cpodsql024": {
			"Type": "AWS::EC2::Instance",
			"Properties": {
				"AvailabilityZone": "us-east-1d",
				"IamInstanceProfile": "Sysco-ApplicationDefaultInstanceProfile-47RRMF15XFMP",
				"ImageId": { "Ref": "CPOD010AMI" },
				"InstanceType": "r4.xlarge",
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
				  { "Key" : "Name", "Value": "ms238cpodsql024" },
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
						"Rename-Computer -NewName ms238cpodsql024 -Restart\n",
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
				"InstanceType": "r4.xlarge",
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
				"InstanceType": "r4.xlarge",
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
				"InstanceType": "r4.xlarge",
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
				"InstanceType": "r4.xlarge",
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
		"ms238cpodsql075": {
			"Type": "AWS::EC2::Instance",
			"Properties": {
				"AvailabilityZone": "us-east-1c",
				"IamInstanceProfile": "Sysco-ApplicationDefaultInstanceProfile-47RRMF15XFMP",
				"ImageId": { "Ref": "CPOD010AMI" },
				"InstanceType": "r4.large",
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
				  { "Key" : "Name", "Value": "ms238cpodsql075" },
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
						"Rename-Computer -NewName ms238cpodsql075 -Restart\n",
						"</powershell>"
					]]}
				}
			}
		},
		"ms238cpodsql076": {
			"Type": "AWS::EC2::Instance",
			"Properties": {
				"AvailabilityZone": "us-east-1d",
				"IamInstanceProfile": "Sysco-ApplicationDefaultInstanceProfile-47RRMF15XFMP",
				"ImageId": { "Ref": "CPOD010AMI" },
				"InstanceType": "r4.large",
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
				  { "Key" : "Name", "Value": "ms238cpodsql076" },
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
						"Rename-Computer -NewName ms238cpodsql076 -Restart\n",
						"</powershell>"
					]]}
				}
			}
		},
		"MS238CPUPSQL01": {
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
							"path=Resources.MS238CPUPSQL01.Metadata.AWS::CloudFormation::Init\n",
							"action=cfn-init.exe -v -s ", { "Ref" : "AWS::StackId" }, " -r MS238CPUPSQL01 --region ", { "Ref" : "AWS::Region" }, "\n"
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
							"aws s3 cp s3://sysco-prod-codedeploy-us-east-1/CloudPricing_UpdateService/", { "Ref" : "EnvironmentShort" }, "/properties/UpdateCP.cmd C:\\temp\\UpdateCP.cmd\n",
							"aws s3 cp s3://sysco-prod-codedeploy-us-east-1/CloudPricing_UpdateService/", { "Ref" : "EnvironmentShort" }, "/properties/CreateTask.xml C:\\temp\\CreateTask.xml\n",
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
				"ImageId": { "Ref" : "CPUP014AMI" },
				"InstanceType": "r4.xlarge",
				"IamInstanceProfile" : { "Ref" : "InstanceProfileUpdateServer" },
				"KeyName": { "Ref": "PemKey2" },
				"SecurityGroupIds": [ { "Ref": "sgDBOD" }, { "Ref" : "NATCLIENT" }, { "Ref" : "CheckMKSG" } ],
				"SubnetId": { "Ref": "Conf1c" },
				"Tags": [
					{ "Key": "Name", "Value": "MS238CPUPSQL01" },
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
					"cfn-init.exe -v -s ", { "Ref" : "AWS::StackId" }, " -r MS238CPUPSQL01 --region ", { "Ref" : "AWS::Region" }, "\n",
					"</script>",
					"<powershell>\n",
					"Rename-Computer -NewName MS238CPUPSQL01 -Restart\n",
					"</powershell>"
				]]}}
			}
		},
		"MS238CPUPSQL02": {
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
							"path=Resources.MS238CPUPSQL02.Metadata.AWS::CloudFormation::Init\n",
							"action=cfn-init.exe -v -s ", { "Ref" : "AWS::StackId" }, " -r MS238CPUPSQL02 --region ", { "Ref" : "AWS::Region" }, "\n"
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
							"aws s3 cp s3://sysco-prod-codedeploy-us-east-1/CloudPricing_UpdateService/", { "Ref" : "EnvironmentShort" }, "/properties/UpdateCP.cmd C:\\temp\\UpdateCP.cmd\n",
							"aws s3 cp s3://sysco-prod-codedeploy-us-east-1/CloudPricing_UpdateService/", { "Ref" : "EnvironmentShort" }, "/properties/CreateTask.xml C:\\temp\\CreateTask.xml\n",
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
				"ImageId": { "Ref" : "CPUP014AMI" },
				"InstanceType": "r4.xlarge",
				"IamInstanceProfile" : { "Ref" : "InstanceProfileUpdateServer" },
				"KeyName": { "Ref": "PemKey2" },
				"SecurityGroupIds": [ { "Ref": "sgDBOD" }, { "Ref" : "NATCLIENT" }, { "Ref" : "CheckMKSG" } ],
				"SubnetId": { "Ref": "Conf1e" },
				"Tags": [
					{ "Key": "Name", "Value": "MS238CPUPSQL02" },
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
					"cfn-init.exe -v -s ", { "Ref" : "AWS::StackId" }, " -r MS238CPUPSQL02 --region ", { "Ref" : "AWS::Region" }, "\n",
					"</script>",
					"<powershell>\n",
					"Rename-Computer -NewName MS238CPUPSQL02 -Restart\n",
					"</powershell>"
				]]}}
			}
		},
		"MS238CPUPSQL03": {
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
							"path=Resources.MS238CPUPSQL03.Metadata.AWS::CloudFormation::Init\n",
							"action=cfn-init.exe -v -s ", { "Ref" : "AWS::StackId" }, " -r MS238CPUPSQL03 --region ", { "Ref" : "AWS::Region" }, "\n"
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
							"aws s3 cp s3://sysco-prod-codedeploy-us-east-1/CloudPricing_UpdateService/", { "Ref" : "EnvironmentShort" }, "/properties/UpdateCP.cmd C:\\temp\\UpdateCP.cmd\n",
							"aws s3 cp s3://sysco-prod-codedeploy-us-east-1/CloudPricing_UpdateService/", { "Ref" : "EnvironmentShort" }, "/properties/CreateTask.xml C:\\temp\\CreateTask.xml\n",
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
				"ImageId": { "Ref" : "CPUP014AMI" },
				"InstanceType": "r4.xlarge",
				"IamInstanceProfile" : { "Ref" : "InstanceProfileUpdateServer" },
				"KeyName": { "Ref": "PemKey2" },
				"SecurityGroupIds": [ { "Ref": "sgDBOD" }, { "Ref" : "NATCLIENT" }, { "Ref" : "CheckMKSG" } ],
				"SubnetId": { "Ref": "Conf1c" },
				"Tags": [
					{ "Key": "Name", "Value": "MS238CPUPSQL03" },
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
					"cfn-init.exe -v -s ", { "Ref" : "AWS::StackId" }, " -r MS238CPUPSQL03 --region ", { "Ref" : "AWS::Region" }, "\n",
					"</script>",
					"<powershell>\n",
					"Rename-Computer -NewName MS238CPUPSQL03 -Restart\n",
					"</powershell>"
				]]}}
			}
		},
		"MS238CPUPSQL04": {
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
							"path=Resources.MS238CPUPSQL04.Metadata.AWS::CloudFormation::Init\n",
							"action=cfn-init.exe -v -s ", { "Ref" : "AWS::StackId" }, " -r MS238CPUPSQL04 --region ", { "Ref" : "AWS::Region" }, "\n"
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
							"aws s3 cp s3://sysco-prod-codedeploy-us-east-1/CloudPricing_UpdateService/", { "Ref" : "EnvironmentShort" }, "/properties/UpdateCP.cmd C:\\temp\\UpdateCP.cmd\n",
							"aws s3 cp s3://sysco-prod-codedeploy-us-east-1/CloudPricing_UpdateService/", { "Ref" : "EnvironmentShort" }, "/properties/CreateTask.xml C:\\temp\\CreateTask.xml\n",
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
				"ImageId": { "Ref" : "CPUP014AMI" },
				"InstanceType": "r4.xlarge",
				"IamInstanceProfile" : { "Ref" : "InstanceProfileUpdateServer" },
				"KeyName": { "Ref": "PemKey2" },
				"SecurityGroupIds": [ { "Ref": "sgDBOD" }, { "Ref" : "NATCLIENT" }, { "Ref" : "CheckMKSG" } ],
				"SubnetId": { "Ref": "Conf1e" },
				"Tags": [
					{ "Key": "Name", "Value": "MS238CPUPSQL04" },
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
					"cfn-init.exe -v -s ", { "Ref" : "AWS::StackId" }, " -r MS238CPUPSQL04 --region ", { "Ref" : "AWS::Region" }, "\n",
					"</script>",
					"<powershell>\n",
					"Rename-Computer -NewName MS238CPUPSQL04 -Restart\n",
					"</powershell>"
				]]}}
			}
		},
		"MS238CPUPSQL05": {
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
							"path=Resources.MS238CPUPSQL05.Metadata.AWS::CloudFormation::Init\n",
							"action=cfn-init.exe -v -s ", { "Ref" : "AWS::StackId" }, " -r MS238CPUPSQL05 --region ", { "Ref" : "AWS::Region" }, "\n"
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
							"aws s3 cp s3://sysco-prod-codedeploy-us-east-1/CloudPricing_UpdateService/", { "Ref" : "EnvironmentShort" }, "/properties/UpdateCP.cmd C:\\temp\\UpdateCP.cmd\n",
							"aws s3 cp s3://sysco-prod-codedeploy-us-east-1/CloudPricing_UpdateService/", { "Ref" : "EnvironmentShort" }, "/properties/CreateTask.xml C:\\temp\\CreateTask.xml\n",
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
				"ImageId": { "Ref" : "CPUP014AMI" },
				"InstanceType": "r4.xlarge",
				"IamInstanceProfile" : { "Ref" : "InstanceProfileUpdateServer" },
				"KeyName": { "Ref": "PemKey2" },
				"SecurityGroupIds": [ { "Ref": "sgDBOD" }, { "Ref" : "NATCLIENT" }, { "Ref" : "CheckMKSG" } ],
				"SubnetId": { "Ref": "Conf1c" },
				"Tags": [
					{ "Key": "Name", "Value": "MS238CPUPSQL05" },
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
					"cfn-init.exe -v -s ", { "Ref" : "AWS::StackId" }, " -r MS238CPUPSQL05 --region ", { "Ref" : "AWS::Region" }, "\n",
					"</script>",
					"<powershell>\n",
					"Rename-Computer -NewName MS238CPUPSQL05 -Restart\n",
					"</powershell>"
				]]}}
			}
		},
		"MS238CPUPSQL06": {
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
							"path=Resources.MS238CPUPSQL06.Metadata.AWS::CloudFormation::Init\n",
							"action=cfn-init.exe -v -s ", { "Ref" : "AWS::StackId" }, " -r MS238CPUPSQL06 --region ", { "Ref" : "AWS::Region" }, "\n"
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
							"aws s3 cp s3://sysco-prod-codedeploy-us-east-1/CloudPricing_UpdateService/", { "Ref" : "EnvironmentShort" }, "/properties/UpdateCP.cmd C:\\temp\\UpdateCP.cmd\n",
							"aws s3 cp s3://sysco-prod-codedeploy-us-east-1/CloudPricing_UpdateService/", { "Ref" : "EnvironmentShort" }, "/properties/CreateTask.xml C:\\temp\\CreateTask.xml\n",
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
				"ImageId": { "Ref" : "CPUP014AMI" },
				"InstanceType": "r4.xlarge",
				"IamInstanceProfile" : { "Ref" : "InstanceProfileUpdateServer" },
				"KeyName": { "Ref": "PemKey2" },
				"SecurityGroupIds": [ { "Ref": "sgDBOD" }, { "Ref" : "NATCLIENT" }, { "Ref" : "CheckMKSG" } ],
				"SubnetId": { "Ref": "Conf1e" },
				"Tags": [
					{ "Key": "Name", "Value": "MS238CPUPSQL06" },
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
					"cfn-init.exe -v -s ", { "Ref" : "AWS::StackId" }, " -r MS238CPUPSQL06 --region ", { "Ref" : "AWS::Region" }, "\n",
					"</script>",
					"<powershell>\n",
					"Rename-Computer -NewName MS238CPUPSQL06 -Restart\n",
					"</powershell>"
				]]}}
			}
		},
		"MS238CPUPSQL07": {
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
							"path=Resources.MS238CPUPSQL07.Metadata.AWS::CloudFormation::Init\n",
							"action=cfn-init.exe -v -s ", { "Ref" : "AWS::StackId" }, " -r MS238CPUPSQL07 --region ", { "Ref" : "AWS::Region" }, "\n"
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
							"aws s3 cp s3://sysco-prod-codedeploy-us-east-1/CloudPricing_UpdateService/", { "Ref" : "EnvironmentShort" }, "/properties/UpdateCP.cmd C:\\temp\\UpdateCP.cmd\n",
							"aws s3 cp s3://sysco-prod-codedeploy-us-east-1/CloudPricing_UpdateService/", { "Ref" : "EnvironmentShort" }, "/properties/CreateTask.xml C:\\temp\\CreateTask.xml\n",
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
				"ImageId": { "Ref" : "CPUP014AMI" },
				"InstanceType": "r4.xlarge",
				"IamInstanceProfile" : { "Ref" : "InstanceProfileUpdateServer" },
				"KeyName": { "Ref": "PemKey2" },
				"SecurityGroupIds": [ { "Ref": "sgDBOD" }, { "Ref" : "NATCLIENT" }, { "Ref" : "CheckMKSG" } ],
				"SubnetId": { "Ref": "Conf1c" },
				"Tags": [
					{ "Key": "Name", "Value": "MS238CPUPSQL07" },
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
					"cfn-init.exe -v -s ", { "Ref" : "AWS::StackId" }, " -r MS238CPUPSQL07 --region ", { "Ref" : "AWS::Region" }, "\n",
					"</script>",
					"<powershell>\n",
					"Rename-Computer -NewName MS238CPUPSQL07 -Restart\n",
					"</powershell>"
				]]}}
			}
		},
		"MS238CPUPSQL08": {
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
							"path=Resources.MS238CPUPSQL08.Metadata.AWS::CloudFormation::Init\n",
							"action=cfn-init.exe -v -s ", { "Ref" : "AWS::StackId" }, " -r MS238CPUPSQL08 --region ", { "Ref" : "AWS::Region" }, "\n"
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
							"aws s3 cp s3://sysco-prod-codedeploy-us-east-1/CloudPricing_UpdateService/", { "Ref" : "EnvironmentShort" }, "/properties/UpdateCP.cmd C:\\temp\\UpdateCP.cmd\n",
							"aws s3 cp s3://sysco-prod-codedeploy-us-east-1/CloudPricing_UpdateService/", { "Ref" : "EnvironmentShort" }, "/properties/CreateTask.xml C:\\temp\\CreateTask.xml\n",
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
				"ImageId": { "Ref" : "CPUP014AMI" },
				"InstanceType": "r4.xlarge",
				"IamInstanceProfile" : { "Ref" : "InstanceProfileUpdateServer" },
				"KeyName": { "Ref": "PemKey2" },
				"SecurityGroupIds": [ { "Ref": "sgDBOD" }, { "Ref" : "NATCLIENT" }, { "Ref" : "CheckMKSG" } ],
				"SubnetId": { "Ref": "Conf1e" },
				"Tags": [
					{ "Key": "Name", "Value": "MS238CPUPSQL08" },
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
					"cfn-init.exe -v -s ", { "Ref" : "AWS::StackId" }, " -r MS238CPUPSQL08 --region ", { "Ref" : "AWS::Region" }, "\n",
					"</script>",
					"<powershell>\n",
					"Rename-Computer -NewName MS238CPUPSQL08 -Restart\n",
					"</powershell>"
				]]}}
			}
		},
		"MS238CPUPSQL09": {
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
							"path=Resources.MS238CPUPSQL09.Metadata.AWS::CloudFormation::Init\n",
							"action=cfn-init.exe -v -s ", { "Ref" : "AWS::StackId" }, " -r MS238CPUPSQL09 --region ", { "Ref" : "AWS::Region" }, "\n"
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
							"aws s3 cp s3://sysco-prod-codedeploy-us-east-1/CloudPricing_UpdateService/", { "Ref" : "EnvironmentShort" }, "/properties/UpdateCP.cmd C:\\temp\\UpdateCP.cmd\n",
							"aws s3 cp s3://sysco-prod-codedeploy-us-east-1/CloudPricing_UpdateService/", { "Ref" : "EnvironmentShort" }, "/properties/CreateTask.xml C:\\temp\\CreateTask.xml\n",
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
				"ImageId": { "Ref" : "CPUP014AMI" },
				"InstanceType": "r4.xlarge",
				"IamInstanceProfile" : { "Ref" : "InstanceProfileUpdateServer" },
				"KeyName": { "Ref": "PemKey2" },
				"SecurityGroupIds": [ { "Ref": "sgDBOD" }, { "Ref" : "NATCLIENT" }, { "Ref" : "CheckMKSG" } ],
				"SubnetId": { "Ref": "Conf1c" },
				"Tags": [
					{ "Key": "Name", "Value": "MS238CPUPSQL09" },
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
					"cfn-init.exe -v -s ", { "Ref" : "AWS::StackId" }, " -r MS238CPUPSQL09 --region ", { "Ref" : "AWS::Region" }, "\n",
					"</script>",
					"<powershell>\n",
					"Rename-Computer -NewName MS238CPUPSQL09 -Restart\n",
					"</powershell>"
				]]}}
			}
		},
		"MS238CPUPSQL10": {
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
							"path=Resources.MS238CPUPSQL10.Metadata.AWS::CloudFormation::Init\n",
							"action=cfn-init.exe -v -s ", { "Ref" : "AWS::StackId" }, " -r MS238CPUPSQL10 --region ", { "Ref" : "AWS::Region" }, "\n"
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
							"aws s3 cp s3://sysco-prod-codedeploy-us-east-1/CloudPricing_UpdateService/", { "Ref" : "EnvironmentShort" }, "/properties/UpdateCP.cmd C:\\temp\\UpdateCP.cmd\n",
							"aws s3 cp s3://sysco-prod-codedeploy-us-east-1/CloudPricing_UpdateService/", { "Ref" : "EnvironmentShort" }, "/properties/CreateTask.xml C:\\temp\\CreateTask.xml\n",
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
				"ImageId": { "Ref" : "CPUP014AMI" },
				"InstanceType": "r4.xlarge",
				"IamInstanceProfile" : { "Ref" : "InstanceProfileUpdateServer" },
				"KeyName": { "Ref": "PemKey2" },
				"SecurityGroupIds": [ { "Ref": "sgDBOD" }, { "Ref" : "NATCLIENT" }, { "Ref" : "CheckMKSG" } ],
				"SubnetId": { "Ref": "Conf1e" },
				"Tags": [
					{ "Key": "Name", "Value": "MS238CPUPSQL10" },
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
					"cfn-init.exe -v -s ", { "Ref" : "AWS::StackId" }, " -r MS238CPUPSQL10 --region ", { "Ref" : "AWS::Region" }, "\n",
					"</script>",
					"<powershell>\n",
					"Rename-Computer -NewName MS238CPUPSQL10 -Restart\n",
					"</powershell>"
				]]}}
			}
		},
		"MS238CPUPSQL11": {
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
							"path=Resources.MS238CPUPSQL11.Metadata.AWS::CloudFormation::Init\n",
							"action=cfn-init.exe -v -s ", { "Ref" : "AWS::StackId" }, " -r MS238CPUPSQL11 --region ", { "Ref" : "AWS::Region" }, "\n"
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
							"aws s3 cp s3://sysco-prod-codedeploy-us-east-1/CloudPricing_UpdateService/", { "Ref" : "EnvironmentShort" }, "/properties/UpdateCP.cmd C:\\temp\\UpdateCP.cmd\n",
							"aws s3 cp s3://sysco-prod-codedeploy-us-east-1/CloudPricing_UpdateService/", { "Ref" : "EnvironmentShort" }, "/properties/CreateTask.xml C:\\temp\\CreateTask.xml\n",
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
				"ImageId": { "Ref" : "CPUP014AMI" },
				"InstanceType": "r4.xlarge",
				"IamInstanceProfile" : { "Ref" : "InstanceProfileUpdateServer" },
				"KeyName": { "Ref": "PemKey2" },
				"SecurityGroupIds": [ { "Ref": "sgDBOD" }, { "Ref" : "NATCLIENT" }, { "Ref" : "CheckMKSG" } ],
				"SubnetId": { "Ref": "Conf1c" },
				"Tags": [
					{ "Key": "Name", "Value": "MS238CPUPSQL11" },
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
					"cfn-init.exe -v -s ", { "Ref" : "AWS::StackId" }, " -r MS238CPUPSQL11 --region ", { "Ref" : "AWS::Region" }, "\n",
					"</script>",
					"<powershell>\n",
					"Rename-Computer -NewName MS238CPUPSQL11 -Restart\n",
					"</powershell>"
				]]}}
			}
		},
		"MS238CPUPSQL12": {
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
							"path=Resources.MS238CPUPSQL12.Metadata.AWS::CloudFormation::Init\n",
							"action=cfn-init.exe -v -s ", { "Ref" : "AWS::StackId" }, " -r MS238CPUPSQL12 --region ", { "Ref" : "AWS::Region" }, "\n"
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
							"aws s3 cp s3://sysco-prod-codedeploy-us-east-1/CloudPricing_UpdateService/", { "Ref" : "EnvironmentShort" }, "/properties/UpdateCP.cmd C:\\temp\\UpdateCP.cmd\n",
							"aws s3 cp s3://sysco-prod-codedeploy-us-east-1/CloudPricing_UpdateService/", { "Ref" : "EnvironmentShort" }, "/properties/CreateTask.xml C:\\temp\\CreateTask.xml\n",
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
				"ImageId": { "Ref" : "CPUP014AMI" },
				"InstanceType": "r4.xlarge",
				"IamInstanceProfile" : { "Ref" : "InstanceProfileUpdateServer" },
				"KeyName": { "Ref": "PemKey2" },
				"SecurityGroupIds": [ { "Ref": "sgDBOD" }, { "Ref" : "NATCLIENT" }, { "Ref" : "CheckMKSG" } ],
				"SubnetId": { "Ref": "Conf1e" },
				"Tags": [
					{ "Key": "Name", "Value": "MS238CPUPSQL12" },
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
					"cfn-init.exe -v -s ", { "Ref" : "AWS::StackId" }, " -r MS238CPUPSQL12 --region ", { "Ref" : "AWS::Region" }, "\n",
					"</script>",
					"<powershell>\n",
					"Rename-Computer -NewName MS238CPUPSQL12 -Restart\n",
					"</powershell>"
				]]}}
			}
		},
		"MS238CPUPSQL13": {
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
							"path=Resources.MS238CPUPSQL13.Metadata.AWS::CloudFormation::Init\n",
							"action=cfn-init.exe -v -s ", { "Ref" : "AWS::StackId" }, " -r MS238CPUPSQL13 --region ", { "Ref" : "AWS::Region" }, "\n"
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
							"aws s3 cp s3://sysco-prod-codedeploy-us-east-1/CloudPricing_UpdateService/", { "Ref" : "EnvironmentShort" }, "/properties/UpdateCP.cmd C:\\temp\\UpdateCP.cmd\n",
							"aws s3 cp s3://sysco-prod-codedeploy-us-east-1/CloudPricing_UpdateService/", { "Ref" : "EnvironmentShort" }, "/properties/CreateTask.xml C:\\temp\\CreateTask.xml\n",
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
				"ImageId": { "Ref" : "CPUP014AMI" },
				"InstanceType": "r4.xlarge",
				"IamInstanceProfile" : { "Ref" : "InstanceProfileUpdateServer" },
				"KeyName": { "Ref": "PemKey2" },
				"SecurityGroupIds": [ { "Ref": "sgDBOD" }, { "Ref" : "NATCLIENT" }, { "Ref" : "CheckMKSG" } ],
				"SubnetId": { "Ref": "Conf1c" },
				"Tags": [
					{ "Key": "Name", "Value": "MS238CPUPSQL13" },
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
					"cfn-init.exe -v -s ", { "Ref" : "AWS::StackId" }, " -r MS238CPUPSQL13 --region ", { "Ref" : "AWS::Region" }, "\n",
					"</script>",
					"<powershell>\n",
					"Rename-Computer -NewName MS238CPUPSQL13 -Restart\n",
					"</powershell>"
				]]}}
			}
		},
		"MS238CPUPSQL14": {
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
							"path=Resources.MS238CPUPSQL14.Metadata.AWS::CloudFormation::Init\n",
							"action=cfn-init.exe -v -s ", { "Ref" : "AWS::StackId" }, " -r MS238CPUPSQL14 --region ", { "Ref" : "AWS::Region" }, "\n"
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
							"aws s3 cp s3://sysco-prod-codedeploy-us-east-1/CloudPricing_UpdateService/", { "Ref" : "EnvironmentShort" }, "/properties/UpdateCP.cmd C:\\temp\\UpdateCP.cmd\n",
							"aws s3 cp s3://sysco-prod-codedeploy-us-east-1/CloudPricing_UpdateService/", { "Ref" : "EnvironmentShort" }, "/properties/CreateTask.xml C:\\temp\\CreateTask.xml\n",
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
				"ImageId": { "Ref" : "CPUP014AMI" },
				"InstanceType": "r4.xlarge",
				"IamInstanceProfile" : { "Ref" : "InstanceProfileUpdateServer" },
				"KeyName": { "Ref": "PemKey2" },
				"SecurityGroupIds": [ { "Ref": "sgDBOD" }, { "Ref" : "NATCLIENT" }, { "Ref" : "CheckMKSG" } ],
				"SubnetId": { "Ref": "Conf1e" },
				"Tags": [
					{ "Key": "Name", "Value": "MS238CPUPSQL14" },
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
					"cfn-init.exe -v -s ", { "Ref" : "AWS::StackId" }, " -r MS238CPUPSQL14 --region ", { "Ref" : "AWS::Region" }, "\n",
					"</script>",
					"<powershell>\n",
					"Rename-Computer -NewName MS238CPUPSQL14 -Restart\n",
					"</powershell>"
				]]}}
			}
		},
		"MS238CPUPSQL15": {
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
							"path=Resources.MS238CPUPSQL15.Metadata.AWS::CloudFormation::Init\n",
							"action=cfn-init.exe -v -s ", { "Ref" : "AWS::StackId" }, " -r MS238CPUPSQL15 --region ", { "Ref" : "AWS::Region" }, "\n"
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
							"aws s3 cp s3://sysco-prod-codedeploy-us-east-1/CloudPricing_UpdateService/", { "Ref" : "EnvironmentShort" }, "/properties/UpdateCP.cmd C:\\temp\\UpdateCP.cmd\n",
							"aws s3 cp s3://sysco-prod-codedeploy-us-east-1/CloudPricing_UpdateService/", { "Ref" : "EnvironmentShort" }, "/properties/CreateTask.xml C:\\temp\\CreateTask.xml\n",
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
				"ImageId": { "Ref" : "CPUP014AMI" },
				"InstanceType": "r4.xlarge",
				"IamInstanceProfile" : { "Ref" : "InstanceProfileUpdateServer" },
				"KeyName": { "Ref": "PemKey2" },
				"SecurityGroupIds": [ { "Ref": "sgDBOD" }, { "Ref" : "NATCLIENT" }, { "Ref" : "CheckMKSG" } ],
				"SubnetId": { "Ref": "Conf1c" },
				"Tags": [
					{ "Key": "Name", "Value": "MS238CPUPSQL15" },
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
					"cfn-init.exe -v -s ", { "Ref" : "AWS::StackId" }, " -r MS238CPUPSQL15 --region ", { "Ref" : "AWS::Region" }, "\n",
					"</script>",
					"<powershell>\n",
					"Rename-Computer -NewName MS238CPUPSQL15 -Restart\n",
					"</powershell>"
				]]}}
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
					{ "Key" : "Name", "Value" : "sg/vpc_sysco_prod_01/cpws_prod_app" },
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