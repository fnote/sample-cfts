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
		"PONumberIBM": {
			"Description": "PO Number for billing IBM",
			"Type": "String",
			"Default": "70000031016",
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
		"ApplicationNameIBM": {
			"Description": "Name of application IBM",
			"Type": "String",
			"Default": "IBM Test Lab Performance Testing",
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
		"ApproverIBM": {
			"Description": "Name of application approver IBM",
			"Type": "String",
			"Default": "Radulovich.Brigitte@corp.sysco.com Saulsberry.Janice@corp.sysco.com",
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
	"PriceWebServiceELB": {
		"Type": "AWS::ElasticLoadBalancing::LoadBalancer",
		"Properties": {
			"Subnets" : [{ "Ref" : "PvtSNc" },{ "Ref" : "PvtSNd" }],
			"LoadBalancerName" : { "Fn::Join" : ["", ["elb-cp-webservice-", { "Ref" : "EnvironmentShort" }]]},
			"Scheme": "internal",
			"CrossZone": "true",
			"SecurityGroups": [ { "Ref": "stgWEBSG" } ],
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
	"PriceConsoleELB": {
		"Type": "AWS::ElasticLoadBalancing::LoadBalancer",
		"Properties": {
			"Subnets" : [{ "Ref" : "PvtSNc" },{ "Ref" : "PvtSNd" }],
			"LoadBalancerName" : { "Fn::Join" : ["", ["elb-cp-console-", { "Ref" : "EnvironmentShort" }]]},
			"Scheme": "internal",
			"CrossZone": "true",
			"SecurityGroups": [ { "Ref": "stgWEBSG" } ],
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
				{ "Key" : "Environment", "Value" : { "Ref" : "Environment" } },
				{ "Key" : "PO_Number", "Value" : { "Ref" : "PONumber" } },
				{ "Key" : "Project_ID", "Value" : { "Ref" : "ProjectId" } },
				{ "Key" : "Owner", "Value" : { "Ref" : "Owner" } },
				{ "Key" : "Approver", "Value" : { "Ref" : "Approver" } }
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
				{ "Key" : "Name", "Value" : "sg/vpc_sysco_stg_01/swmsmobile_stg_db" },
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
	"MS238CPODSQL11S": {
	"Type": "AWS::EC2::Instance",
	"Properties": {
		"AvailabilityZone": "us-east-1c",
		"DisableApiTermination": "false",
		"ImageId": "ami-22ceb134",
		"InstanceType": "r3.xlarge",
		"KeyName": { "Ref": "PemKey2" },
		"SecurityGroupIds": [
		  { "Ref": "sgDBOD" },
		  { "Ref": "NATaccessSG" },
		  { "Ref": "CheckMKSG" }
		],
		"SubnetId": { "Ref": "PvtSNc" },
		"Tags": [
			{ "Key" : "Name", "Value" : "MS238CPODSQL11S" },
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
                "Rename-Computer -NewName MS238CPODSQL11S -Restart\n",
                "</powershell>"
              ]
            ]
          }
        }
      }
	},
	"MS238CPODSQL12S": {
	"Type": "AWS::EC2::Instance",
	"Properties": {
		"AvailabilityZone": "us-east-1d",
		"DisableApiTermination": "false",
		"ImageId": "ami-22ceb134",
		"InstanceType": "r3.xlarge",
		"KeyName": { "Ref": "PemKey" },
		"SecurityGroupIds": [
		  { "Ref": "sgDBOD" },
		  { "Ref": "NATaccessSG" },
		  { "Ref": "CheckMKSG" }
		],
		"SubnetId": { "Ref": "PvtSNd" },
		"Tags": [
			{ "Key" : "Name", "Value" : "MS238CPODSQL12S" },
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
                "Rename-Computer -NewName MS238CPODSQL12S -Restart\n",
                "</powershell>"
              ]
            ]
          }
        }
      }
    },
    	"MS238CPODSQL13S": {
	"Type": "AWS::EC2::Instance",
	"Properties": {
		"AvailabilityZone": "us-east-1c",
		"DisableApiTermination": "false",
		"EbsOptimized" : "true",
		"ImageId": "ami-2f2e0839",
		"InstanceType": "r4.xlarge",
		"KeyName": { "Ref": "PemKey2" },
		"SecurityGroupIds": [
		  { "Ref": "sgDBOD" },
		  { "Ref": "NATaccessSG" },
		  { "Ref": "CheckMKSG" }
		],
		"SubnetId": { "Ref": "PvtSNc" },
			"BlockDeviceMappings" : [ 
			{
					"DeviceName" : "/dev/sda1",
					"Ebs" : {
					"VolumeSize" : "300",
					"VolumeType" : "gp2"
					}
				}
				],
		"Tags": [
			{ "Key" : "Name", "Value" : "MS238CPODSQL13S" },
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
                "Rename-Computer -NewName MS238CPODSQL13S -Restart\n",
                "</powershell>"
              ]
            ]
          }
        }
      }
	},
	    	"MS238CPODSQL14S": {
	"Type": "AWS::EC2::Instance",
	"Properties": {
		"AvailabilityZone": "us-east-1c",
		"DisableApiTermination": "false",
		"EbsOptimized" : "true",
		"ImageId": "ami-2f2e0839",
		"InstanceType": "r4.xlarge",
		"KeyName": { "Ref": "PemKey2" },
		"SecurityGroupIds": [
		  { "Ref": "sgDBOD" },
		  { "Ref": "NATaccessSG" },
		  { "Ref": "CheckMKSG" }
		],
		"SubnetId": { "Ref": "PvtSNc" },
		"BlockDeviceMappings" : [ 
			{
					"DeviceName" : "/dev/sda1",
					"Ebs" : {
					"VolumeSize" : "300",
					"VolumeType" : "gp2"
					}
				}			
				],
		"Tags": [
			{ "Key" : "Name", "Value" : "MS238CPODSQL14S" },
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
                "Rename-Computer -NewName MS238CPODSQL14S -Restart\n",
                "</powershell>"
              ]
            ]
          }
        }
      }
	},
	"ms238cpodsqlbase": {
		"Type": "AWS::EC2::Instance",
		"Properties": {
			"AvailabilityZone": "us-east-1c",
			"DisableApiTermination": "false",
			"ImageId": "ami-d47102c2",
			"InstanceType": "c4.xlarge",
			"KeyName": { "Ref": "PemKey2" },
			"SecurityGroupIds": [
				{ "Ref": "TuningDBSG" },
				{ "Ref": "NATaccessSG" },
				{ "Ref": "CheckMKSG" }
			],
			"SubnetId": { "Ref": "PvtSNc" },
			"Tags": [
				{ "Key" : "Name", "Value" : "ms238cpodsqlbase" },
				{ "Key" : "Application_Id", "Value" : { "Ref" : "ApplicationId" } },
				{ "Key" : "Application_Name", "Value" : { "Ref" : "ApplicationName" } },
				{ "Key" : "Environment", "Value" : { "Ref" : "Environment" } },
				{ "Key" : "PO_Number", "Value" : { "Ref" : "PONumber" } },
				{ "Key" : "Project_ID", "Value" : { "Ref" : "ProjectId" } },
				{ "Key" : "Owner", "Value" : { "Ref" : "Owner" } },
				{ "Key" : "Approver", "Value" : { "Ref" : "Approver" } }
			]
		}
	},
	"ms238cpodsql60s": {
		"Type": "AWS::EC2::Instance",
		"Properties": {
			"AvailabilityZone": "us-east-1c",
			"DisableApiTermination": "false",
			"ImageId": "ami-1a54450c",
			"InstanceType": "r4.xlarge",
			"KeyName": { "Ref": "PemKey2" },
			"SecurityGroupIds": [
				{ "Ref": "TuningDBSG" },
				{ "Ref": "NATaccessSG" },
				{ "Ref": "CheckMKSG" }
			],
			"SubnetId": { "Ref": "PvtSNc" },
			"BlockDeviceMappings" : [{
				"DeviceName" : "/dev/sda1",
				"Ebs" : {
						"VolumeSize" : "300",
						"VolumeType" : "gp2"
					}
			}],
			"Tags": [
				{ "Key" : "Name", "Value" : "ms238cpodsql60s" },
				{ "Key" : "Application_Id", "Value" : { "Ref" : "ApplicationId" } },
				{ "Key" : "Application_Name", "Value" : { "Ref" : "ApplicationName" } },
				{ "Key" : "Environment", "Value" : { "Ref" : "Environment" } },
				{ "Key" : "PO_Number", "Value" : { "Ref" : "PONumber" } },
				{ "Key" : "Project_ID", "Value" : { "Ref" : "ProjectId" } },
				{ "Key" : "Owner", "Value" : { "Ref" : "Owner" } },
				{ "Key" : "Approver", "Value" : { "Ref" : "Approver" } }
			],
			"UserData": { "Fn::Base64": { "Fn::Join": [ "", [
				"<powershell>\n",
				"Rename-Computer -NewName ms238cpodsql60s -Restart\n",
				"</powershell>"
			]]}}
		}
    },
	"ms238cpodsql61s": {
		"Type": "AWS::EC2::Instance",
		"Properties": {
			"AvailabilityZone": "us-east-1d",
			"DisableApiTermination": "false",
			"ImageId": "ami-1a54450c",
			"InstanceType": "r4.xlarge",
			"KeyName": { "Ref": "PemKey2" },
			"SecurityGroupIds": [
				{ "Ref": "TuningDBSG" },
				{ "Ref": "NATaccessSG" },
				{ "Ref": "CheckMKSG" }
			],
			"SubnetId": { "Ref": "PvtSNd" },
			"BlockDeviceMappings" : [{
				"DeviceName" : "/dev/sda1",
				"Ebs" : {
						"VolumeSize" : "300",
						"VolumeType" : "gp2"
					}
			}],
			"Tags": [
				{ "Key" : "Name", "Value" : "ms238cpodsql61s" },
				{ "Key" : "Application_Id", "Value" : { "Ref" : "ApplicationId" } },
				{ "Key" : "Application_Name", "Value" : { "Ref" : "ApplicationName" } },
				{ "Key" : "Environment", "Value" : { "Ref" : "Environment" } },
				{ "Key" : "PO_Number", "Value" : { "Ref" : "PONumber" } },
				{ "Key" : "Project_ID", "Value" : { "Ref" : "ProjectId" } },
				{ "Key" : "Owner", "Value" : { "Ref" : "Owner" } },
				{ "Key" : "Approver", "Value" : { "Ref" : "Approver" } }
			],
			"UserData": { "Fn::Base64": { "Fn::Join": [ "", [
				"<powershell>\n",
				"Rename-Computer -NewName ms238cpodsql61s -Restart\n",
				"</powershell>"
			]]}}
		}
    },
    	"ms238cpodsql62s": {
		"Type": "AWS::EC2::Instance",
		"Properties": {
			"AvailabilityZone": "us-east-1c",
			"DisableApiTermination": "false",
			"EbsOptimized" : "true",
			"ImageId": "ami-1a54450c",
			"InstanceType": "m4.xlarge",
			"KeyName": { "Ref": "PemKey2" },
			"SecurityGroupIds": [
				{ "Ref": "TuningDBSG" },
				{ "Ref": "NATaccessSG" },
				{ "Ref": "CheckMKSG" }
			],
			"SubnetId": { "Ref": "PvtSNc" },
			"BlockDeviceMappings" : [{
				"DeviceName" : "/dev/sda1",
				"Ebs" : {
						"VolumeSize" : "300",
						"VolumeType" : "gp2"
					}
			}],
			"Tags": [
				{ "Key" : "Name", "Value" : "ms238cpodsql62s" },
				{ "Key" : "Application_Id", "Value" : { "Ref" : "ApplicationId" } },
				{ "Key" : "Application_Name", "Value" : { "Ref" : "ApplicationName" } },
				{ "Key" : "Environment", "Value" : { "Ref" : "Environment" } },
				{ "Key" : "PO_Number", "Value" : { "Ref" : "PONumber" } },
				{ "Key" : "Project_ID", "Value" : { "Ref" : "ProjectId" } },
				{ "Key" : "Owner", "Value" : { "Ref" : "Owner" } },
				{ "Key" : "Approver", "Value" : { "Ref" : "Approver" } }
			],
			"UserData": { "Fn::Base64": { "Fn::Join": [ "", [
				"<powershell>\n",
				"Rename-Computer -NewName ms238cpodsql62s -Restart\n",
				"</powershell>"
			]]}}
		}
    },
		"ms238cpodsql63s": {
		"Type": "AWS::EC2::Instance",
		"Properties": {
			"AvailabilityZone": "us-east-1c",
			"DisableApiTermination": "false",
			"EbsOptimized" : "true",
			"ImageId": "ami-1a54450c",
			"InstanceType": "m4.xlarge",
			"KeyName": { "Ref": "PemKey2" },
			"SecurityGroupIds": [
				{ "Ref": "TuningDBSG" },
				{ "Ref": "NATaccessSG" },
				{ "Ref": "CheckMKSG" }
			],
			"SubnetId": { "Ref": "PvtSNc" },
			"BlockDeviceMappings" : [{
				"DeviceName" : "/dev/sda1",
				"Ebs" : {
						"VolumeSize" : "300",
						"VolumeType" : "gp2"
					}
			}],
			"Tags": [
				{ "Key" : "Name", "Value" : "ms238cpodsql63s" },
				{ "Key" : "Application_Id", "Value" : { "Ref" : "ApplicationId" } },
				{ "Key" : "Application_Name", "Value" : { "Ref" : "ApplicationName" } },
				{ "Key" : "Environment", "Value" : { "Ref" : "Environment" } },
				{ "Key" : "PO_Number", "Value" : { "Ref" : "PONumber" } },
				{ "Key" : "Project_ID", "Value" : { "Ref" : "ProjectId" } },
				{ "Key" : "Owner", "Value" : { "Ref" : "Owner" } },
				{ "Key" : "Approver", "Value" : { "Ref" : "Approver" } }
			],
			"UserData": { "Fn::Base64": { "Fn::Join": [ "", [
				"<powershell>\n",
				"Rename-Computer -NewName ms238cpodsql63s -Restart\n",
				"</powershell>"
			]]}}
		}
    },
    "ms238cpodsql64s": {
		"Type": "AWS::EC2::Instance",
		"Properties": {
			"AvailabilityZone": "us-east-1c",
			"DisableApiTermination": "false",
			"EbsOptimized" : "true",
			"ImageId": "ami-1a54450c",
			"InstanceType": "c4.xlarge",
			"KeyName": { "Ref": "PemKey2" },
			"SecurityGroupIds": [
				{ "Ref": "TuningDBSG" },
				{ "Ref": "NATaccessSG" },
				{ "Ref": "CheckMKSG" }
			],
			"SubnetId": { "Ref": "PvtSNc" },
			"BlockDeviceMappings" : [{
				"DeviceName" : "/dev/sda1",
				"Ebs" : {
						"VolumeSize" : "300",
						"VolumeType" : "gp2"
					}
			}],
			"Tags": [
				{ "Key" : "Name", "Value" : "ms238cpodsql64s" },
				{ "Key" : "Application_Id", "Value" : { "Ref" : "ApplicationId" } },
				{ "Key" : "Application_Name", "Value" : { "Ref" : "ApplicationName" } },
				{ "Key" : "Environment", "Value" : { "Ref" : "Environment" } },
				{ "Key" : "PO_Number", "Value" : { "Ref" : "PONumber" } },
				{ "Key" : "Project_ID", "Value" : { "Ref" : "ProjectId" } },
				{ "Key" : "Owner", "Value" : { "Ref" : "Owner" } },
				{ "Key" : "Approver", "Value" : { "Ref" : "Approver" } }
			],
			"UserData": { "Fn::Base64": { "Fn::Join": [ "", [
				"<powershell>\n",
				"Rename-Computer -NewName ms238cpodsql64s -Restart\n",
				"</powershell>"
			]]}}
		}
    },
    "ms238cpodsql65s": {
		"Type": "AWS::EC2::Instance",
		"Properties": {
			"AvailabilityZone": "us-east-1c",
			"DisableApiTermination": "false",
			"EbsOptimized" : "true",
			"ImageId": "ami-1a54450c",
			"InstanceType": "c4.xlarge",
			"KeyName": { "Ref": "PemKey2" },
			"SecurityGroupIds": [
				{ "Ref": "TuningDBSG" },
				{ "Ref": "NATaccessSG" },
				{ "Ref": "CheckMKSG" }
			],
			"SubnetId": { "Ref": "PvtSNc" },
			"BlockDeviceMappings" : [{
				"DeviceName" : "/dev/sda1",
				"Ebs" : {
						"VolumeSize" : "300",
						"VolumeType" : "gp2"
					}
			}],
			"Tags": [
				{ "Key" : "Name", "Value" : "ms238cpodsql65s" },
				{ "Key" : "Application_Id", "Value" : { "Ref" : "ApplicationId" } },
				{ "Key" : "Application_Name", "Value" : { "Ref" : "ApplicationName" } },
				{ "Key" : "Environment", "Value" : { "Ref" : "Environment" } },
				{ "Key" : "PO_Number", "Value" : { "Ref" : "PONumber" } },
				{ "Key" : "Project_ID", "Value" : { "Ref" : "ProjectId" } },
				{ "Key" : "Owner", "Value" : { "Ref" : "Owner" } },
				{ "Key" : "Approver", "Value" : { "Ref" : "Approver" } }
			],
			"UserData": { "Fn::Base64": { "Fn::Join": [ "", [
				"<powershell>\n",
				"Rename-Computer -NewName ms238cpodsql65s -Restart\n",
				"</powershell>"
			]]}}
		}
    },
    "ms238cpodsql66s": {
		"Type": "AWS::EC2::Instance",
		"Properties": {
			"AvailabilityZone": "us-east-1c",
			"DisableApiTermination": "false",
			"EbsOptimized" : "true",
			"ImageId": "ami-1a54450c",
			"InstanceType": "i3.xlarge",
			"KeyName": { "Ref": "PemKey2" },
			"SecurityGroupIds": [
				{ "Ref": "TuningDBSG" },
				{ "Ref": "NATaccessSG" },
				{ "Ref": "CheckMKSG" }
			],
			"SubnetId": { "Ref": "PvtSNc" },
			"BlockDeviceMappings" : [{
				"DeviceName" : "/dev/sda1",
				"Ebs" : {
						"VolumeSize" : "300",
						"VolumeType" : "gp2"
					}
			}],
			"Tags": [
				{ "Key" : "Name", "Value" : "ms238cpodsql66s" },
				{ "Key" : "Application_Id", "Value" : { "Ref" : "ApplicationId" } },
				{ "Key" : "Application_Name", "Value" : { "Ref" : "ApplicationName" } },
				{ "Key" : "Environment", "Value" : { "Ref" : "Environment" } },
				{ "Key" : "PO_Number", "Value" : { "Ref" : "PONumber" } },
				{ "Key" : "Project_ID", "Value" : { "Ref" : "ProjectId" } },
				{ "Key" : "Owner", "Value" : { "Ref" : "Owner" } },
				{ "Key" : "Approver", "Value" : { "Ref" : "Approver" } }
			],
			"UserData": { "Fn::Base64": { "Fn::Join": [ "", [
				"<powershell>\n",
				"Rename-Computer -NewName ms238cpodsql66s -Restart\n",
				"</powershell>"
			]]}}
		}
    },
    "ms238cpodsql67s": {
		"Type": "AWS::EC2::Instance",
		"Properties": {
			"AvailabilityZone": "us-east-1c",
			"DisableApiTermination": "false",
			"EbsOptimized" : "true",
			"ImageId": "ami-1a54450c",
			"InstanceType": "i3.xlarge",
			"KeyName": { "Ref": "PemKey2" },
			"SecurityGroupIds": [
				{ "Ref": "TuningDBSG" },
				{ "Ref": "NATaccessSG" },
				{ "Ref": "CheckMKSG" }
			],
			"SubnetId": { "Ref": "PvtSNc" },
			"BlockDeviceMappings" : [{
				"DeviceName" : "/dev/sda1",
				"Ebs" : {
						"VolumeSize" : "300",
						"VolumeType" : "gp2"
					}
			}],
			"Tags": [
				{ "Key" : "Name", "Value" : "ms238cpodsql67s" },
				{ "Key" : "Application_Id", "Value" : { "Ref" : "ApplicationId" } },
				{ "Key" : "Application_Name", "Value" : { "Ref" : "ApplicationName" } },
				{ "Key" : "Environment", "Value" : { "Ref" : "Environment" } },
				{ "Key" : "PO_Number", "Value" : { "Ref" : "PONumber" } },
				{ "Key" : "Project_ID", "Value" : { "Ref" : "ProjectId" } },
				{ "Key" : "Owner", "Value" : { "Ref" : "Owner" } },
				{ "Key" : "Approver", "Value" : { "Ref" : "Approver" } }
			],
			"UserData": { "Fn::Base64": { "Fn::Join": [ "", [
				"<powershell>\n",
				"Rename-Computer -NewName ms238cpodsql67s -Restart\n",
				"</powershell>"
			]]}}
		}
    },
        "ms238cpodsql68s": {
		"Type": "AWS::EC2::Instance",
		"Properties": {
			"AvailabilityZone": "us-east-1c",
			"DisableApiTermination": "false",
			"EbsOptimized" : "true",
			"ImageId": "ami-feecb185",
			"InstanceType": "i3.xlarge",
			"KeyName": { "Ref": "PemKey2" },
			"SecurityGroupIds": [
				{ "Ref": "TuningDBSG" },
				{ "Ref": "NATaccessSG" },
				{ "Ref": "CheckMKSG" }
			],
			"SubnetId": { "Ref": "PvtSNc" },
			"Tags": [
				{ "Key" : "Name", "Value" : "ms238cpodsql68s" },
				{ "Key" : "Application_Id", "Value" : { "Ref" : "ApplicationId" } },
				{ "Key" : "Application_Name", "Value" : { "Ref" : "ApplicationName" } },
				{ "Key" : "Environment", "Value" : { "Ref" : "Environment" } },
				{ "Key" : "PO_Number", "Value" : { "Ref" : "PONumber" } },
				{ "Key" : "Project_ID", "Value" : { "Ref" : "ProjectId" } },
				{ "Key" : "Owner", "Value" : { "Ref" : "Owner" } },
				{ "Key" : "Approver", "Value" : { "Ref" : "Approver" } }
			],
			"UserData": { "Fn::Base64": { "Fn::Join": [ "", [
				"<powershell>\n",
				"Rename-Computer -NewName ms238cpodsql68s -Restart\n",
				"</powershell>"
			]]}}
		}
    },
            "ms238cpodsql69s": {
		"Type": "AWS::EC2::Instance",
		"Properties": {
			"AvailabilityZone": "us-east-1c",
			"DisableApiTermination": "false",
			"EbsOptimized" : "true",
			"ImageId": "ami-feecb185",
			"InstanceType": "i3.xlarge",
			"KeyName": { "Ref": "PemKey2" },
			"SecurityGroupIds": [
				{ "Ref": "TuningDBSG" },
				{ "Ref": "NATaccessSG" },
				{ "Ref": "CheckMKSG" }
			],
			"SubnetId": { "Ref": "PvtSNc" },
			"Tags": [
				{ "Key" : "Name", "Value" : "ms238cpodsql69s" },
				{ "Key" : "Application_Id", "Value" : { "Ref" : "ApplicationId" } },
				{ "Key" : "Application_Name", "Value" : { "Ref" : "ApplicationName" } },
				{ "Key" : "Environment", "Value" : { "Ref" : "Environment" } },
				{ "Key" : "PO_Number", "Value" : { "Ref" : "PONumber" } },
				{ "Key" : "Project_ID", "Value" : { "Ref" : "ProjectId" } },
				{ "Key" : "Owner", "Value" : { "Ref" : "Owner" } },
				{ "Key" : "Approver", "Value" : { "Ref" : "Approver" } }
			],
			"UserData": { "Fn::Base64": { "Fn::Join": [ "", [
				"<powershell>\n",
				"Rename-Computer -NewName ms238cpodsql69s -Restart\n",
				"</powershell>"
			]]}}
		}
    },         
    "ms238cpodsql70s": {
		"Type": "AWS::EC2::Instance",
		"Properties": {
			"AvailabilityZone": "us-east-1c",
			"DisableApiTermination": "false",
			"EbsOptimized" : "true",
			"ImageId": { "Ref": "ODAMI" },
			"InstanceType": "r4.xlarge",
			"KeyName": { "Ref": "PemKey2" },
			"SecurityGroupIds": [
				{ "Ref": "TuningDBSG" },
				{ "Ref": "NATaccessSG" },
				{ "Ref": "CheckMKSG" }
			],
			"SubnetId": { "Ref": "PvtSNc" },
			"BlockDeviceMappings" : [{
				"DeviceName" : "/dev/sda1",
				"Ebs" : {
						"VolumeSize" : "300",
						"VolumeType" : "gp2"
					}
			}],
			"Tags": [
				{ "Key" : "Name", "Value" : "ms238cpodsql70s" },
				{ "Key" : "Application_Id", "Value" : { "Ref" : "ApplicationId" } },
				{ "Key" : "Application_Name", "Value" : { "Ref" : "ApplicationName" } },
				{ "Key" : "Environment", "Value" : { "Ref" : "Environment" } },
				{ "Key" : "PO_Number", "Value" : { "Ref" : "PONumber" } },
				{ "Key" : "Project_ID", "Value" : { "Ref" : "ProjectId" } },
				{ "Key" : "Owner", "Value" : { "Ref" : "Owner" } },
				{ "Key" : "Approver", "Value" : { "Ref" : "Approver" } }
			],
			"UserData": { "Fn::Base64": { "Fn::Join": [ "", [
				"<powershell>\n",
				"Rename-Computer -NewName ms238cpodsql70s -Restart\n",
				"</powershell>"
			]]}}
		}
    },
    "ms238cpodsql71s": {
		"Type": "AWS::EC2::Instance",
		"Properties": {
			"AvailabilityZone": "us-east-1c",
			"DisableApiTermination": "false",
			"EbsOptimized" : "true",
			"ImageId": { "Ref": "ODAMI" },
			"InstanceType": "r4.xlarge",
			"KeyName": { "Ref": "PemKey2" },
			"SecurityGroupIds": [
				{ "Ref": "TuningDBSG" },
				{ "Ref": "NATaccessSG" },
				{ "Ref": "CheckMKSG" }
			],
			"SubnetId": { "Ref": "PvtSNc" },
			"BlockDeviceMappings" : [{
				"DeviceName" : "/dev/sda1",
				"Ebs" : {
						"VolumeSize" : "300",
						"VolumeType" : "gp2"
					}
			}],
			"Tags": [
				{ "Key" : "Name", "Value" : "ms238cpodsql71s" },
				{ "Key" : "Application_Id", "Value" : { "Ref" : "ApplicationId" } },
				{ "Key" : "Application_Name", "Value" : { "Ref" : "ApplicationName" } },
				{ "Key" : "Environment", "Value" : { "Ref" : "Environment" } },
				{ "Key" : "PO_Number", "Value" : { "Ref" : "PONumber" } },
				{ "Key" : "Project_ID", "Value" : { "Ref" : "ProjectId" } },
				{ "Key" : "Owner", "Value" : { "Ref" : "Owner" } },
				{ "Key" : "Approver", "Value" : { "Ref" : "Approver" } }
			],
			"UserData": { "Fn::Base64": { "Fn::Join": [ "", [
				"<powershell>\n",
				"Rename-Computer -NewName ms238cpodsql71s -Restart\n",
				"</powershell>"
			]]}}
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
				{ "Key" : "Name", "Value" : "sg/vpc_sysco_stg_01/cpdbod_stg_app" },
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
	"ms238cpodsql51s": {
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
			{ "Key" : "Name", "Value" : "ms238cpodsql51s" },
			{ "Key" : "Application_Id", "Value" : { "Ref" : "ApplicationId" } },
			{ "Key" : "Application_Name", "Value" : { "Ref" : "ApplicationNameIBM" } },
			{ "Key" : "Environment", "Value" : { "Ref" : "Environment" } },
			{ "Key" : "PO_Number", "Value" : { "Ref" : "PONumberIBM" } },
			{ "Key" : "Project_ID", "Value" : { "Ref" : "ProjectId" } },
			{ "Key" : "Owner", "Value" : { "Ref" : "Owner" } },
			{ "Key" : "Approver", "Value" : { "Ref" : "ApproverIBM" } }
		],
		"UserData": {
          "Fn::Base64": {
            "Fn::Join": [
              "",
              [
                "<powershell>\n",
                "Rename-Computer -NewName ms238cpodsql51s -Restart\n",
                "</powershell>"
              ]
            ]
          }
        }
      }
	},
	"ms238cpodsql52s": {
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
			{ "Key" : "Name", "Value" : "ms238cpodsql52s" },
			{ "Key" : "Application_Id", "Value" : { "Ref" : "ApplicationId" } },
			{ "Key" : "Application_Name", "Value" : { "Ref" : "ApplicationNameIBM" } },
			{ "Key" : "Environment", "Value" : { "Ref" : "Environment" } },
			{ "Key" : "PO_Number", "Value" : { "Ref" : "PONumberIBM" } },
			{ "Key" : "Project_ID", "Value" : { "Ref" : "ProjectId" } },
			{ "Key" : "Owner", "Value" : { "Ref" : "Owner" } },
			{ "Key" : "Approver", "Value" : { "Ref" : "ApproverIBM" } }
		],
		"UserData": {
          "Fn::Base64": {
            "Fn::Join": [
              "",
              [
                "<powershell>\n",
                "Rename-Computer -NewName ms238cpodsql52s -Restart\n",
                "</powershell>"
              ]
            ]
          }
        }
      }
	},
	"ms238cpodsql53s": {
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
			{ "Key" : "Name", "Value" : "ms238cpodsql53s" },
			{ "Key" : "Application_Id", "Value" : { "Ref" : "ApplicationId" } },
			{ "Key" : "Application_Name", "Value" : { "Ref" : "ApplicationNameIBM" } },
			{ "Key" : "Environment", "Value" : { "Ref" : "Environment" } },
			{ "Key" : "PO_Number", "Value" : { "Ref" : "PONumberIBM" } },
			{ "Key" : "Project_ID", "Value" : { "Ref" : "ProjectId" } },
			{ "Key" : "Owner", "Value" : { "Ref" : "Owner" } },
			{ "Key" : "Approver", "Value" : { "Ref" : "ApproverIBM" } }
		],
		"UserData": {
          "Fn::Base64": {
            "Fn::Join": [
              "",
              [
                "<powershell>\n",
                "Rename-Computer -NewName ms238cpodsql53s -Restart\n",
                "</powershell>"
              ]
            ]
          }
        }
      }
	},
	"ms238cpodsql54s": {
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
			{ "Key" : "Name", "Value" : "ms238cpodsql54s" },
			{ "Key" : "Application_Id", "Value" : { "Ref" : "ApplicationId" } },
			{ "Key" : "Application_Name", "Value" : { "Ref" : "ApplicationNameIBM" } },
			{ "Key" : "Environment", "Value" : { "Ref" : "Environment" } },
			{ "Key" : "PO_Number", "Value" : { "Ref" : "PONumberIBM" } },
			{ "Key" : "Project_ID", "Value" : { "Ref" : "ProjectId" } },
			{ "Key" : "Owner", "Value" : { "Ref" : "Owner" } },
			{ "Key" : "Approver", "Value" : { "Ref" : "ApproverIBM" } }
		],
        "UserData": {
          "Fn::Base64": {
            "Fn::Join": [
              "",
              [
                "<powershell>\n",
                "Rename-Computer -NewName ms238cpodsql54s -Restart\n",
                "</powershell>"
              ]
            ]
          }
        }
		}
	},
	"ms238cpodsql55s": {
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
			{ "Key" : "Name", "Value" : "ms238cpodsql55s" },
			{ "Key" : "Application_Id", "Value" : { "Ref" : "ApplicationId" } },
			{ "Key" : "Application_Name", "Value" : { "Ref" : "ApplicationNameIBM" } },
			{ "Key" : "Environment", "Value" : { "Ref" : "Environment" } },
			{ "Key" : "PO_Number", "Value" : { "Ref" : "PONumberIBM" } },
			{ "Key" : "Project_ID", "Value" : { "Ref" : "ProjectId" } },
			{ "Key" : "Owner", "Value" : { "Ref" : "Owner" } },
			{ "Key" : "Approver", "Value" : { "Ref" : "ApproverIBM" } }
		],
        "UserData": {
          "Fn::Base64": {
            "Fn::Join": [
              "",
              [
                "<powershell>\n",
                "Rename-Computer -NewName ms238cpodsql55s -Restart\n",
                "</powershell>"
              ]
            ]
          }
        }
      }
    },
    "ms238cpodsql56s": {
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
			{ "Key" : "Name", "Value" : "ms238cpodsql56s" },
			{ "Key" : "Application_Id", "Value" : { "Ref" : "ApplicationId" } },
			{ "Key" : "Application_Name", "Value" : { "Ref" : "ApplicationNameIBM" } },
			{ "Key" : "Environment", "Value" : { "Ref" : "Environment" } },
			{ "Key" : "PO_Number", "Value" : { "Ref" : "PONumberIBM" } },
			{ "Key" : "Project_ID", "Value" : { "Ref" : "ProjectId" } },
			{ "Key" : "Owner", "Value" : { "Ref" : "Owner" } },
			{ "Key" : "Approver", "Value" : { "Ref" : "ApproverIBM" } }
        ],
        "UserData": {
          "Fn::Base64": {
            "Fn::Join": [
              "",
              [
                "<powershell>\n",
                "Rename-Computer -NewName ms238cpodsql56s -Restart\n",
                "</powershell>"
              ]
            ]
          }
        }
      }
    },
	"ms238cpodsql57s": {
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
			{ "Key" : "Name", "Value" : "ms238cpodsql57s" },
			{ "Key" : "Application_Id", "Value" : { "Ref" : "ApplicationId" } },
			{ "Key" : "Application_Name", "Value" : { "Ref" : "ApplicationNameIBM" } },
			{ "Key" : "Environment", "Value" : { "Ref" : "Environment" } },
			{ "Key" : "PO_Number", "Value" : { "Ref" : "PONumberIBM" } },
			{ "Key" : "Project_ID", "Value" : { "Ref" : "ProjectId" } },
			{ "Key" : "Owner", "Value" : { "Ref" : "Owner" } },
			{ "Key" : "Approver", "Value" : { "Ref" : "ApproverIBM" } }
		],
        "UserData": {
          "Fn::Base64": {
            "Fn::Join": [
              "",
              [
                "<powershell>\n",
                "Rename-Computer -NewName ms238cpodsql57s -Restart\n",
                "</powershell>"
              ]
            ]
          }
        }
      }
    },
	"ms238cpodsql58s": {
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
			{ "Key" : "Name", "Value" : "ms238cpodsql58s" },
			{ "Key" : "Application_Id", "Value" : { "Ref" : "ApplicationId" } },
			{ "Key" : "Application_Name", "Value" : { "Ref" : "ApplicationNameIBM" } },
			{ "Key" : "Environment", "Value" : { "Ref" : "Environment" } },
			{ "Key" : "PO_Number", "Value" : { "Ref" : "PONumberIBM" } },
			{ "Key" : "Project_ID", "Value" : { "Ref" : "ProjectId" } },
			{ "Key" : "Owner", "Value" : { "Ref" : "Owner" } },
			{ "Key" : "Approver", "Value" : { "Ref" : "ApproverIBM" } }
		],
        "UserData": {
          "Fn::Base64": {
            "Fn::Join": [
              "",
              [
                "<powershell>\n",
                "Rename-Computer -NewName ms238cpodsql58s -Restart\n",
                "</powershell>"
              ]
            ]
          }
        }
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
			"SecurityGroupIds": [ { "Ref": "TuningDBSG" }, { "Ref" : "NATaccessSG" }, { "Ref" : "CheckMKSG" } ],
			"SubnetId": { "Ref": "PvtSNc" },
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
			"SecurityGroupIds": [ { "Ref": "TuningDBSG" }, { "Ref" : "NATaccessSG" }, { "Ref" : "CheckMKSG" } ],
			"SubnetId": { "Ref": "PvtSNe" },
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
	"stgCPELB": {
		"Type": "AWS::ElasticLoadBalancing::LoadBalancer",
		"Properties": {
			"Subnets": [ { "Ref": "PvtSNc" }, { "Ref": "PvtSNd" } ],
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
				{ "Key" : "Application_Name", "Value" : { "Ref" : "ApplicationName" } },
				{ "Key" : "Application_Id", "Value" : { "Ref" : "ApplicationId" } },
				{ "Key" : "Environment", "Value" : { "Ref" : "Environment" } },
				{ "Key" : "PO_Number", "Value" : { "Ref" : "PONumber" } },
				{ "Key" : "Project_ID", "Value" : { "Ref" : "ProjectId" } },
				{ "Key" : "Owner", "Value" : { "Ref" : "Owner" } },
				{ "Key" : "Approver", "Value" : { "Ref" : "Approver" } }
			]
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