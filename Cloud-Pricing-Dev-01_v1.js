{
  "AWSTemplateFormatVersion": "2010-09-09",
  "Description": "Deployed via Cloud-Pricing-Dev-01_v1",
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
    "VPCID": {
      "Description": "Name of and existing VPC",
      "Type": "String",
      "Default": "vpc-ff88269a"
    },
    "DevDBSG": {
      "Description": "Name of and existing VPC",
      "Type": "String",
      "Default": "sg-fb6c6b9e"
    },
    "NATaccessSG": {
      "Description": "NAT access Security Group",
      "Type": "String",
      "Default": "sg-e151a186",
      "ConstraintDescription": "Must be a valid NAT Security Group."
    },
    "CheckMKSG": {
      "Description": "NAT access Security Group",
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
    "PemKey": {
      "Description": "Name of and existing EC2 KeyPair to enable SSH access to the instance",
      "Type": "String",
      "Default": "Sysco-KP-CP-NonProd"
    },
    "ApplicationName": {
      "Description": "Name of application",
      "Type": "String",
      "Default": "Cloud Pricing Dev",
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
      "Default": " Sheraz Khan Karen Williams",
      "MinLength": "1",
      "MaxLength": "255"
    },
    "Owner": {
      "Description": "Name of application owner",
      "Type": "String",
      "Default": "Darcy Tomaszewski Samir Patel James Owen",
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
      "Default": "Development",
      "AllowedValues": [
        "Sandbox",
        "Development",
        "Quality",
        "Staging",
        "Training",
        "Production"
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
                "command": "PowerShell.exe -ExecutionPolicy Bypass -File D:\\AutomateDeployment.ps1 WS DEV 5",
                "waitAfterCompletion": "300"
              }
            }
          }
        }
      },
      "Properties": {
        "KeyName": { "Ref": "PemKey" },
        "ImageId": "ami-9ae1cdf2",
        "SecurityGroups": [ { "Ref": "DevWEBSG" } ],
        "InstanceType": "m3.medium",
        "UserData": {
          "Fn::Base64": {
            "Fn::Join": [
              "",
              [
                "<script>\n",
                "cfn-init.exe -v -s ",
                { "Ref": "AWS::StackName" },
                " -r WebLaunchConfig",
                " --region ",
                { "Ref": "AWS::Region" },
                "\n",
                "</script>"
              ]
            ]
          }
        }
      }
    },
    "MS238CPWS04d": {
      "Type": "AWS::EC2::Instance",
      "Properties": {
        "AvailabilityZone": "us-east-1c",
        "DisableApiTermination": "true",
        "ImageId": "ami-9ae1cdf2",
        "InstanceType": "m3.medium",
        "KeyName": { "Ref": "PemKey" },
        "SecurityGroupIds": [ { "Ref": "DevWEBSG" } ],
        "SubnetId": { "Ref": "PvtSNc" },
        "UserData": {
          "Fn::Base64": {
            "Fn::Join": [
              "",
              [
                "<script>\n",
                "cfn-init.exe -v -s ",
                { "Ref": "AWS::StackName" },
                " -r WebLaunchConfig",
                " --region ",
                { "Ref": "AWS::Region" },
                "\n",
                "</script>"
              ]
            ]
          }
        },
        "Tags": [
          {
            "Key": "Name",
            "Value": "MS238CPWS04d"
          },
          {
            "Key": "Application_Id",
            "Value": { "Ref": "ApplicationId" }
          },
          {
            "Key": "Application_Name",
            "Value": "Cloud Pricing"
          },
          {
            "Key": "Environment",
            "Value": { "Ref": "Environment" }
          },
          {
            "Key": "PO_Number",
            "Value": { "Ref": "PONumber" }
          },
          {
            "Key": "Project_ID",
            "Value": { "Ref": "ProjectId" }
          },
          {
            "Key": "System_Type",
            "Value": "Application Server"
          },
          {
            "Key": "Owner",
            "Value": { "Ref": "Owner" }
          },
          {
            "Key": "Approver",
            "Value": { "Ref": "Approver" }
          }
        ]
      }
    },
    "MS238CPWS03d": {
      "Type": "AWS::EC2::Instance",
      "Properties": {
        "AvailabilityZone": "us-east-1c",
        "DisableApiTermination": "true",
        "ImageId": "ami-9ae1cdf2",
        "InstanceType": "m3.medium",
        "KeyName": { "Ref": "PemKey" },
        "SecurityGroupIds": [ { "Ref": "DevWEBSG" } ],
        "SubnetId": { "Ref": "PvtSNc" },
        "UserData": {
          "Fn::Base64": {
            "Fn::Join": [
              "",
              [
                "<script>\n",
                "cfn-init.exe -v -s ",
                { "Ref": "AWS::StackName" },
                " -r WebLaunchConfig",
                " --region ",
                { "Ref": "AWS::Region" },
                "\n",
                "</script>"
              ]
            ]
          }
        },
        "Tags": [
          {
            "Key": "Name",
            "Value": "MS238CPWS03d"
          },
          {
            "Key": "Application_Id",
            "Value": { "Ref": "ApplicationId" }
          },
          {
            "Key": "Application_Name",
            "Value": "Cloud Pricing"
          },
          {
            "Key": "Environment",
            "Value": { "Ref": "Environment" }
          },
          {
            "Key": "PO_Number",
            "Value": { "Ref": "PONumber" }
          },
          {
            "Key": "Project_ID",
            "Value": { "Ref": "ProjectId" }
          },
          {
            "Key": "System_Type",
            "Value": "Application Server"
          },
          {
            "Key": "Owner",
            "Value": { "Ref": "Owner" }
          },
          {
            "Key": "Approver",
            "Value": { "Ref": "Approver" }
          }
        ]
      }
    },
    "DevWEBSG": {
      "Type": "AWS::EC2::SecurityGroup",
      "Properties": {
        "GroupDescription": "Dev web services security group",
        "VpcId": { "Ref": "VPCID" },
        "SecurityGroupIngress": [
          {
            "IpProtocol": "tcp",
            "FromPort": "80",
            "ToPort": "80",
            "CidrIp": "10.0.0.0/8"
          },
          {
            "IpProtocol": "tcp",
            "FromPort": "443",
            "ToPort": "443",
            "CidrIp": "10.0.0.0/8"
          },
          {
            "IpProtocol": "tcp",
            "FromPort": "3389",
            "ToPort": "3389",
            "CidrIp": "10.0.0.0/8"
          }
        ],
        "Tags": [
          {
            "Key": "Name",
            "Value": "sg/vpc_sysco_nonprod_02/cp_web_dev"
          }
        ]
      }
    },
    "IngressAdder1": {
      "DependsOn": "DevWEBSG",
      "Type": "AWS::EC2::SecurityGroupIngress",
      "Properties": {
        "FromPort": "-1",
        "GroupId": { "Ref": "DevWEBSG" },
        "IpProtocol": "-1",
        "SourceSecurityGroupId": { "Ref": "DevWEBSG" },
        "ToPort": "-1"
      }
    },
    "CPDEVELB": {
      "Type": "AWS::ElasticLoadBalancing::LoadBalancer",
      "Properties": {
        "Subnets": [ { "Ref": "PvtSNc" } ],
        "LoadBalancerName": "elb-ws01-cp-dev",
        "Scheme": "internal",
        "CrossZone": "true",
        "Instances": [
          { "Ref": "MS238CPWS04d" },
          { "Ref": "MS238CPWS03d" }
        ],
        "SecurityGroups": [ { "Ref": "DevWEBSG" } ],
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
          "HealthyThreshold": "10",
          "UnhealthyThreshold": "2",
          "Interval": "30",
          "Timeout": "5"
        },
        "Tags": [
          {
            "Key": "Name",
            "Value": "elb_ws01/vpc_sysco_nonprod_02/cp_dev"
          },
          {
            "Key": "Application_Name",
            "Value": "Cloud Pricing"
          },
          {
            "Key": "Environment",
            "Value": { "Ref": "Environment" }
          },
          {
            "Key": "PO_Number",
            "Value": { "Ref": "PONumber" }
          },
          {
            "Key": "Owner",
            "Value": { "Ref": "Owner" }
          }
        ]
      }
    },
    "MS238CPSQL04d": {
      "Type": "AWS::EC2::Instance",
      "Properties": {
        "AvailabilityZone": "us-east-1c",
        "DisableApiTermination": "true",
        "ImageId": { "Ref": "CommonAMI" },
        "InstanceType": "m3.large",
        "KeyName": { "Ref": "PemKey" },
        "SecurityGroupIds": [ { "Ref": "DevDBSG" } ],
        "SubnetId": { "Ref": "PvtSNc" },
        "Tags": [
          {
            "Key": "Name",
            "Value": "MS238CPSQL04d"
          },
          {
            "Key": "Application_Id",
            "Value": { "Ref": "ApplicationId" }
          },
          {
            "Key": "Application_Name",
            "Value": "Cloud Pricing"
          },
          {
            "Key": "Environment",
            "Value": { "Ref": "Environment" }
          },
          {
            "Key": "PO_Number",
            "Value": { "Ref": "PONumber" }
          },
          {
            "Key": "Project_ID",
            "Value": { "Ref": "ProjectId" }
          },
          {
            "Key": "System_Type",
            "Value": " Database"
          },
          {
            "Key": "Owner",
            "Value": { "Ref": "Owner" }
          },
          {
            "Key": "Approver",
            "Value": { "Ref": "Approver" }
          }
        ]
      }
    },
    "MS238CPBTSQL01d": {
      "Type": "AWS::EC2::Instance",
      "Properties": {
        "AvailabilityZone": "us-east-1c",
        "DisableApiTermination": "false",
        "ImageId": { "Ref": "ODAMI" },
        "InstanceType": "m3.large",
        "KeyName": { "Ref": "PemKey" },
        "SecurityGroupIds": [
          { "Ref": "DevDBSG" },
          { "Ref": "NATaccessSG" },
          { "Ref": "CheckMKSG" }
        ],
        "SubnetId": { "Ref": "PvtSNc" },
        "Tags": [
          {
            "Key": "Name",
            "Value": "MS238CPBTSQL01d"
          },
          {
            "Key": "Application_Name",
            "Value": { "Ref": "ApplicationName" }
          },
          {
            "Key": "Application_Id",
            "Value": { "Ref": "ApplicationId" }
          },
          {
            "Key": "Environment",
            "Value": { "Ref": "Environment" }
          },
          {
            "Key": "PO_Number",
            "Value": { "Ref": "PONumber" }
          },
          {
            "Key": "Project_ID",
            "Value": { "Ref": "ProjectId" }
          },
          {
            "Key": "Owner",
            "Value": { "Ref": "Owner" }
          },
          {
            "Key": "Approver",
            "Value": { "Ref": "Approver" }
          }
        ],
        "UserData": {
          "Fn::Base64": {
            "Fn::Join": [
              "",
              [
                "<powershell>\n",
                "Rename-Computer -NewName ms238cpbtsql03q -Restart\n",
                "</powershell>"
              ]
            ]
          }
        }
      }
    },
    "MS238CPBTSQL02d": {
      "Type": "AWS::EC2::Instance",
      "Properties": {
        "AvailabilityZone": "us-east-1c",
        "DisableApiTermination": "false",
        "ImageId": { "Ref": "ODAMI" },
        "InstanceType": "m3.large",
        "KeyName": { "Ref": "PemKey" },
        "SecurityGroupIds": [
          { "Ref": "DevDBSG" },
          { "Ref": "NATaccessSG" },
          { "Ref": "CheckMKSG" }
        ],
        "SubnetId": { "Ref": "PvtSNc" },
        "Tags": [
          {
            "Key": "Name",
            "Value": "MS238CPBTSQL02d"
          },
          {
            "Key": "Application_Name",
            "Value": { "Ref": "ApplicationName" }
          },
          {
            "Key": "Application_Id",
            "Value": { "Ref": "ApplicationId" }
          },
          {
            "Key": "Environment",
            "Value": { "Ref": "Environment" }
          },
          {
            "Key": "PO_Number",
            "Value": { "Ref": "PONumber" }
          },
          {
            "Key": "Project_ID",
            "Value": { "Ref": "ProjectId" }
          },
          {
            "Key": "Owner",
            "Value": { "Ref": "Owner" }
          },
          {
            "Key": "Approver",
            "Value": { "Ref": "Approver" }
          }
        ],
        "UserData": {
          "Fn::Base64": {
            "Fn::Join": [
              "",
              [
                "<powershell>\n",
                "Rename-Computer -NewName ms238cpbtsql03q -Restart\n",
                "</powershell>"
              ]
            ]
          }
        }
      }
    },
    "MS238CPBTSQL08d": {
      "Type": "AWS::EC2::Instance",
      "Properties": {
        "AvailabilityZone": "us-east-1c",
        "DisableApiTermination": "false",
        "ImageId": { "Ref": "ODAMI" },
        "InstanceType": "m3.large",
        "KeyName": { "Ref": "PemKey" },
        "SecurityGroupIds": [
          { "Ref": "DevDBSG" },
          { "Ref": "NATaccessSG" },
          { "Ref": "CheckMKSG" }
        ],
        "SubnetId": { "Ref": "PvtSNc" },
        "Tags": [
          {
            "Key": "Name",
            "Value": "ms238cpbtsql08d"
          },
          {
            "Key": "Application_Name",
            "Value": { "Ref": "ApplicationName" }
          },
          {
            "Key": "Application_Id",
            "Value": { "Ref": "ApplicationId" }
          },
          {
            "Key": "Environment",
            "Value": { "Ref": "Environment" }
          },
          {
            "Key": "PO_Number",
            "Value": { "Ref": "PONumber" }
          },
          {
            "Key": "Project_ID",
            "Value": { "Ref": "ProjectId" }
          },
          {
            "Key": "Owner",
            "Value": { "Ref": "Owner" }
          },
          {
            "Key": "Approver",
            "Value": { "Ref": "Approver" }
          }
        ],
        "UserData": {
          "Fn::Base64": {
            "Fn::Join": [
              "",
              [
                "<powershell>\n",
                "Rename-Computer -NewName ms238cpbtsql08d -Restart\n",
                "</powershell>"
              ]
            ]
          }
        }
      }
    },
    "MS238CPBTSQL09d": {
      "Type": "AWS::EC2::Instance",
      "Properties": {
        "AvailabilityZone": "us-east-1d",
        "DisableApiTermination": "false",
        "ImageId": { "Ref": "ODAMI" },
        "InstanceType": "m3.large",
        "KeyName": { "Ref": "PemKey" },
        "SecurityGroupIds": [
          { "Ref": "DevDBSG" },
          { "Ref": "NATaccessSG" },
          { "Ref": "CheckMKSG" }
        ],
        "SubnetId": { "Ref": "PvtSNd" },
        "Tags": [
          {
            "Key": "Name",
            "Value": "ms238cpbtsql09d"
          },
          {
            "Key": "Application_Name",
            "Value": { "Ref": "ApplicationName" }
          },
          {
            "Key": "Application_Id",
            "Value": { "Ref": "ApplicationId" }
          },
          {
            "Key": "Environment",
            "Value": { "Ref": "Environment" }
          },
          {
            "Key": "PO_Number",
            "Value": { "Ref": "PONumber" }
          },
          {
            "Key": "Project_ID",
            "Value": { "Ref": "ProjectId" }
          },
          {
            "Key": "Owner",
            "Value": { "Ref": "Owner" }
          },
          {
            "Key": "Approver",
            "Value": { "Ref": "Approver" }
          }
        ],
        "UserData": {
          "Fn::Base64": {
            "Fn::Join": [
              "",
              [
                "<powershell>\n",
                "Rename-Computer -NewName ms238cpbtsql09d -Restart\n",
                "</powershell>"
              ]
            ]
          }
        }
      }
    },
    "MS238CPODSQL01d": {
      "Type": "AWS::EC2::Instance",
      "Properties": {
        "AvailabilityZone": "us-east-1c",
        "DisableApiTermination": "false",
        "ImageId": { "Ref": "ODAMI" },
        "InstanceType": "m3.large",
        "KeyName": { "Ref": "PemKey" },
        "SecurityGroupIds": [
          { "Ref": "DevDBSG" },
          { "Ref": "NATaccessSG" },
          { "Ref": "CheckMKSG" }
        ],
        "SubnetId": { "Ref": "PvtSNc" },
        "Tags": [
          {
            "Key": "Name",
            "Value": "MS238CPODSQL01d"
          },
          {
            "Key": "Application_Name",
            "Value": { "Ref": "ApplicationName" }
          },
          {
            "Key": "Application_Id",
            "Value": { "Ref": "ApplicationId" }
          },
          {
            "Key": "Environment",
            "Value": { "Ref": "Environment" }
          },
          {
            "Key": "PO_Number",
            "Value": { "Ref": "PONumber" }
          },
          {
            "Key": "Project_ID",
            "Value": { "Ref": "ProjectId" }
          },
          {
            "Key": "Owner",
            "Value": { "Ref": "Owner" }
          },
          {
            "Key": "Approver",
            "Value": { "Ref": "Approver" }
          }
        ],
        "UserData": {
          "Fn::Base64": {
            "Fn::Join": [
              "",
              [
                "<powershell>\n",
                "Rename-Computer -NewName ms238cpodsql03q -Restart\n",
                "</powershell>"
              ]
            ]
          }
        }
      }
    },
    "MS238CPODSQL02d": {
      "Type": "AWS::EC2::Instance",
      "Properties": {
        "AvailabilityZone": "us-east-1c",
        "DisableApiTermination": "false",
        "ImageId": { "Ref": "ODAMI" },
        "InstanceType": "m3.large",
        "KeyName": { "Ref": "PemKey" },
        "SecurityGroupIds": [
          { "Ref": "DevDBSG" },
          { "Ref": "NATaccessSG" },
          { "Ref": "CheckMKSG" }
        ],
        "SubnetId": { "Ref": "PvtSNc" },
        "Tags": [
          {
            "Key": "Name",
            "Value": "MS238CPODSQL02d"
          },
          {
            "Key": "Application_Name",
            "Value": { "Ref": "ApplicationName" }
          },
          {
            "Key": "Application_Id",
            "Value": { "Ref": "ApplicationId" }
          },
          {
            "Key": "Environment",
            "Value": { "Ref": "Environment" }
          },
          {
            "Key": "PO_Number",
            "Value": { "Ref": "PONumber" }
          },
          {
            "Key": "Project_ID",
            "Value": { "Ref": "ProjectId" }
          },
          {
            "Key": "Owner",
            "Value": { "Ref": "Owner" }
          },
          {
            "Key": "Approver",
            "Value": { "Ref": "Approver" }
          }
        ],
        "UserData": {
          "Fn::Base64": {
            "Fn::Join": [
              "",
              [
                "<powershell>\n",
                "Rename-Computer -NewName ms238cpodsql03q -Restart\n",
                "</powershell>"
              ]
            ]
          }
        }
      }
    },
    "MS238CPODSQL08d": {
      "Type": "AWS::EC2::Instance",
      "Properties": {
        "AvailabilityZone": "us-east-1c",
        "DisableApiTermination": "false",
        "ImageId": { "Ref": "ODAMI" },
        "InstanceType": "m3.large",
        "KeyName": { "Ref": "PemKey" },
        "SecurityGroupIds": [
          { "Ref": "DevDBSG" },
          { "Ref": "NATaccessSG" },
          { "Ref": "CheckMKSG" }
        ],
        "SubnetId": { "Ref": "PvtSNc" },
        "Tags": [
          {
            "Key": "Name",
            "Value": "ms238cpodsql08d"
          },
          {
            "Key": "Application_Name",
            "Value": { "Ref": "ApplicationName" }
          },
          {
            "Key": "Application_Id",
            "Value": { "Ref": "ApplicationId" }
          },
          {
            "Key": "Environment",
            "Value": { "Ref": "Environment" }
          },
          {
            "Key": "PO_Number",
            "Value": { "Ref": "PONumber" }
          },
          {
            "Key": "Project_ID",
            "Value": { "Ref": "ProjectId" }
          },
          {
            "Key": "Owner",
            "Value": { "Ref": "Owner" }
          },
          {
            "Key": "Approver",
            "Value": { "Ref": "Approver" }
          }
        ],
        "UserData": {
          "Fn::Base64": {
            "Fn::Join": [
              "",
              [
                "<powershell>\n",
                "Rename-Computer -NewName ms238cpodsql08d -Restart\n",
                "</powershell>"
              ]
            ]
          }
        }
      }
    },
    "MS238CPODSQL09d": {
      "Type": "AWS::EC2::Instance",
      "Properties": {
        "AvailabilityZone": "us-east-1d",
        "DisableApiTermination": "false",
        "ImageId": { "Ref": "ODAMI" },
        "InstanceType": "m3.large",
        "KeyName": { "Ref": "PemKey" },
        "SecurityGroupIds": [
          { "Ref": "DevDBSG" },
          { "Ref": "NATaccessSG" },
          { "Ref": "CheckMKSG" }
        ],
        "SubnetId": { "Ref": "PvtSNd" },
        "Tags": [
          {
            "Key": "Name",
            "Value": "ms238cpodsql09d"
          },
          {
            "Key": "Application_Name",
            "Value": { "Ref": "ApplicationName" }
          },
          {
            "Key": "Application_Id",
            "Value": { "Ref": "ApplicationId" }
          },
          {
            "Key": "Environment",
            "Value": { "Ref": "Environment" }
          },
          {
            "Key": "PO_Number",
            "Value": { "Ref": "PONumber" }
          },
          {
            "Key": "Project_ID",
            "Value": { "Ref": "ProjectId" }
          },
          {
            "Key": "Owner",
            "Value": { "Ref": "Owner" }
          },
          {
            "Key": "Approver",
            "Value": { "Ref": "Approver" }
          }
        ],
        "UserData": {
          "Fn::Base64": {
            "Fn::Join": [
              "",
              [
                "<powershell>\n",
                "Rename-Computer -NewName ms238cpodsql09d -Restart\n",
                "</powershell>"
              ]
            ]
          }
        }
      }
    }
  }
}