{
  "AWSTemplateFormatVersion": "2010-09-09",

  "Description": "Deployed via Cloud-Pricing-Tuning-01_v2 - New Relic Pro Agent installed on web servers as well as jar files for JVM",

  "Parameters": {

    "PvtSNc": {
      "Description": "Private subnet for confidential apps in us-east-1c",
      "Type": "String",
      "Default": "subnet-b61cbb9d"
    },
    "stgWEBSG": {
      "Description": "Cloud Pricing Tuning Web Servers Security Group",
      "Type": "String",
      "Default": "sg-14d48271"
    },
    "VPCID": {
      "Description": "Name of and existing VPC",
      "Type": "String",
      "Default": "vpc-ff88269a"
    },
    "PemKey": {
      "Description": "Name of and existing EC2 KeyPair to enable SSH access to the instance",
      "Type": "String",
      "Default": "Sysco-KP-CP-NonProd"
    },
    "Private2c": {
      "Description": "Non-Production Confidential us-east-1c subnet",
      "Type": "String",
      "Default": "subnet-b61cbb9d"
    },
    "Private2d": {
      "Description": "Non-Production Confidential us-east-1d subnet",
      "Type": "String",
      "Default": "subnet-ea138a9d"
    },
    "TuningDBSG": {
      "Description": "DB security group",
      "Type": "String",
      "Default": "sg-ecd48289",
      "ConstraintDescription": "Must be a valid NAT Security Group."
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
    "PONumber": {
      "Description": "PO Number for billing",
      "Type": "String",
      "Default": "7000000347",
      "MinLength": "1",
      "MaxLength": "255",
      "AllowedPattern": "[\\x20-\\x7E]*",
      "ConstraintDescription": "Must contain only ASCII characters."
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
    "WebServerGroup": {
      "Type": "AWS::AutoScaling::AutoScalingGroup",
      "Properties": {
        "AvailabilityZones": [ "us-east-1c", "us-east-1d" ],
        "LaunchConfigurationName": { "Ref": "WebLaunchConfig" },
        "MinSize": "2",
        "MaxSize": "6",
        "DesiredCapacity": "2",
        "VPCZoneIdentifier": [
          { "Ref": "Private2c" },
          { "Ref": "Private2d" }
        ],
        "LoadBalancerNames": [ { "Ref": "stgCPELB" } ],
        "Tags": [
          {
            "Key": "Name",
            "Value": "CP Tuning Web Autoscale Instance",
            "PropagateAtLaunch": "true"
          },
          {
            "Key": "Application_Name",
            "Value": "Cloud Pricing",
            "PropagateAtLaunch": "true"
          },
          {
            "Key": "Environment",
            "Value": "Tuning",
            "PropagateAtLaunch": "true"
          },
          {
            "Key": "Security_Classification",
            "Value": "Confidential",
            "PropagateAtLaunch": "true"
          },
          {
            "Key": "Cost_Center",
            "Value": "USFBTECH PO 28843",
            "PropagateAtLaunch": "true"
          },
          {
            "Key": "Support_Criticality",
            "Value": "High",
            "PropagateAtLaunch": "true"
          },
          {
            "Key": "Application_Id",
            "Value": "APP-001151",
            "PropagateAtLaunch": "true"
          },
          {
            "Key": "System_Type",
            "Value": "Application Server",
            "PropagateAtLaunch": "true"
          },
          {
            "Key": "Owner",
            "Value": "Sheraz Khan",
            "PropagateAtLaunch": "true"
          },
          {
            "Key": "Approver",
            "Value": "Sheraz Khan",
            "PropagateAtLaunch": "true"
          }
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
          {
            "Name": "AutoScalingGroupName",
            "Value": { "Ref": "WebServerGroup" }
          }
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
        "SecurityGroupIds": [ "sg-e151a186", "sg-ecd48289", "sg-0f7fc468" ],
        "SubnetId": "subnet-b91a1291",
        "Tags": [
          {
            "Key": "Name",
            "Value": "MS238CPBRFS01s"
          },
          {
            "Key": "Application_Name",
            "Value": "Cloud Pricing Non Prod"
          },
          {
            "Key": "Environment",
            "Value": "Tuning"
          },
          {
            "Key": "Cost_Center",
            "Value": "7000000347"
          },
          {
            "Key": "Application_Id",
            "Value": "APP-001151"
          },
          {
            "Key": "Owner",
            "Value": "Darcy Tomaszewski, Samir Patel, James Owen"
          },
          {
            "Key": "Approver",
            "Value": "Sheraz Khan"
          }
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
        "InstanceType": "m3.large",
        "KeyName": { "Ref": "PemKey" },
        "SecurityGroupIds": [
          { "Ref": "TuningDBSG" },
          { "Ref": "NATaccessSG" },
          { "Ref": "CheckMKSG" }
        ],
        "SubnetId": { "Ref": "Private2c" },
        "Tags": [
          {
            "Key": "Name",
            "Value": "ms238cpbtsql08s"
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
        "InstanceType": "m3.large",
        "KeyName": { "Ref": "PemKey" },
        "SecurityGroupIds": [
          { "Ref": "TuningDBSG" },
          { "Ref": "NATaccessSG" },
          { "Ref": "CheckMKSG" }
        ],
        "SubnetId": { "Ref": "Private2d" },
        "Tags": [
          {
            "Key": "Name",
            "Value": "ms238cpbtsql09s"
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
        "InstanceType": "m3.large",
        "KeyName": { "Ref": "PemKey" },
        "SecurityGroupIds": [
          { "Ref": "TuningDBSG" },
          { "Ref": "NATaccessSG" },
          { "Ref": "CheckMKSG" }
        ],
        "SubnetId": { "Ref": "Private2c" },
        "Tags": [
          {
            "Key": "Name",
            "Value": "ms238cpodsql08s"
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
        "InstanceType": "m3.large",
        "KeyName": { "Ref": "PemKey" },
        "SecurityGroupIds": [
          { "Ref": "TuningDBSG" },
          { "Ref": "NATaccessSG" },
          { "Ref": "CheckMKSG" }
        ],
        "SubnetId": { "Ref": "Private2d" },
        "Tags": [
          {
            "Key": "Name",
            "Value": "ms238cpodsql09s"
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
                "Rename-Computer -NewName ms238cpodsql09s -Restart\n",
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
        "Subnets": [
          { "Ref": "Private2c" },
          { "Ref": "Private2d" }
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
          {
            "Key": "Name",
            "Value": "elb_ws01/vpc_sysco_nonprod_02/cp_web_tuning"
          },
          {
            "Key": "Application_Name",
            "Value": "Cloud Pricing"
          },
          {
            "Key": "Environment",
            "Value": "Tuning"
          },
          {
            "Key": "Security_Classification",
            "Value": "Confidential"
          },
          {
            "Key": "Cost_Center",
            "Value": "USFBTECH PO 28843"
          },
          {
            "Key": "Owner",
            "Value": "Sheraz Khan"
          }
        ]
      }
    }

  }
}
