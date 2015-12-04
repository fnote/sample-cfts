{
    "AWSTemplateFormatVersion": "2010-09-09",
    "Description": "Deployed via Cloud-Pricing-Prod-02.js",
    "Parameters": {
        "PemKey": {
            "Description": "Name of and existing EC2 KeyPair to enable SSH access to the instance",
            "Type": "String",
            "Default": "KeyPair-Sysco-CI-Management"
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
        "CommonAMI": {
            "Description": "Common Database Instances AMI",
            "Type": "String",
            "Default": "ami-42437f2a"
        },
        "CPAS03": {
            "Description": "Admin Console Instances AMI",
            "Type": "String",
            "Default": "ami-320e0b5a"
        },
        "CPFS01": {
            "Description": "File Server Instances AMI",
            "Type": "String",
            "Default": "ami-c68eb2ae"
        },
        "ODAMI": {
            "Description": "On Demand Database Instances AMI",
            "Type": "String",
            "Default": "ami-2202074a"
        },
        "BTAMI": {
            "Description": "Batch Database Instances AMI",
            "Type": "String",
            "Default": "ami-2202074a"
        },
        "CPAS02": {
            "Description": "Web Server Instances AMI",
            "Type": "String",
            "Default": "ami-1bb1c57e"
        },
        "NATCLIENT": {
            "Description": "nat client sg",
            "Type": "String",
            "Default": "sg-1803c47f"
        },
        "VPCID": {
            "Description": "Name of and existing VPC",
            "Type": "String",
            "Default": "vpc-99e855fc"
        },
        "Approver" : {
            "Description" : "Name of application approver",
            "Type" : "String",
            "Default" : "Sheraz Khan Karen Williams",
			"MinLength" : "1",
			"MaxLength" : "255"
        },
        "Owner" : {
            "Description" : "Name of application owner",
            "Type" : "String",
            "Default" : "Darcy Tomaszewski Samir Patel James Owen",
			"MinLength" : "1",
			"MaxLength" : "255"
        },
        "CostCenter" : {
            "Description" : "PO Number for billing",
            "Type" : "String",
            "Default" : "7000000347",
			"MinLength" : "1",
			"MaxLength" : "255",
			"AllowedPattern" : "[\\x20-\\x7E]*",
			"ConstraintDescription" : "Must contain only ASCII characters."
        }
    },
    "Resources": {
        "CPWEBSG": {
            "Type": "AWS::EC2::SecurityGroup",
            "Properties": {
                "GroupDescription": "Web Services",
                "VpcId": {
                    "Ref": "VPCID"
                },
                "SecurityGroupIngress": [
                    {
                        "IpProtocol": "tcp",
                        "FromPort": "80",
                        "ToPort": "80",
                        "CidrIp": "10.0.0.0/8"
                    },
                    {
                        "IpProtocol": "tcp",
                        "FromPort": "3389",
                        "ToPort": "3389",
                        "CidrIp": "10.0.0.0/8"
                    },
                    {
                        "IpProtocol": "tcp",
                        "FromPort": "443",
                        "ToPort": "443",
                        "CidrIp": "10.0.0.0/8"
                    }
                ],
                "Tags": [
                    {
                        "Key": "Name",
                        "Value": "sg/vpc_sysco_prod_01/cp_web"
                    },
                    {
                        "Key": "Application_Name",
                        "Value": "Cloud Pricing"
                    },
                    {
                        "Key": "Environment",
                        "Value": "Production"
                    },
                    {
                        "Key": "Security_Classification",
                        "Value": "Confidential"
                    },
                    {
                        "Key": "Cost_Center",
                        "Value" : { "Ref" : "CostCenter" }
                    },
                    {
                        "Key": "Owner",
                        "Value" : { "Ref" : "Owner" }
                    },
                    {
                        "Key": "System_Type",
                        "Value": " Networking"
                    },
                    {
                        "Key": "Support_Criticality",
                        "Value": "High"
                    },
                    {
                        "Key": "Application_Id",
                        "Value": "APP-001151"
                    },
                    {
                        "Key": "Approver",
                        "Value" : { "Ref" : "Approver" }
                    }
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
                "SecurityGroupIngress": [
                    {
                        "IpProtocol": "-1",
                        "FromPort": "-1",
                        "ToPort": "-1",
                        "SourceSecurityGroupId": {
                            "Ref": "CPWEBSG"
                        }
                    },
                    {
                        "IpProtocol": "tcp",
                        "FromPort": "3389",
                        "ToPort": "3389",
                        "CidrIp": "10.0.0.0/8"
                    },
                    {
                        "IpProtocol": "icmp",
                        "FromPort": "-1",
                        "ToPort": "-1",
                        "CidrIp": "10.0.0.0/8"
                    },
                    {
                        "IpProtocol": "tcp",
                        "FromPort": "3181",
                        "ToPort": "3181",
                        "CidrIp": "10.0.0.0/8"
                    },
                    {
                        "IpProtocol": "tcp",
                        "FromPort": "1433",
                        "ToPort": "1433",
                        "CidrIp": "10.0.0.0/8"
                    }
                ],
                "Tags": [
                    {
                        "Key": "Name",
                        "Value": "sg/vpc_sysco_prod_01/cp_db"
                    },
                    {
                        "Key": "Application_Name",
                        "Value": "Cloud Pricing"
                    },
                    {
                        "Key": "Environment",
                        "Value": "Production"
                    },
                    {
                        "Key": "Security_Classification",
                        "Value": "Confidential"
                    },
                    {
                        "Key": "Cost_Center",
                        "Value" : { "Ref" : "CostCenter" }
                    },
                    {
                        "Key": "Owner",
                        "Value" : { "Ref" : "Owner" }
                    },
                    {
                        "Key": "System_Type",
                        "Value": " Networking"
                    },
                    {
                        "Key": "Support_Criticality",
                        "Value": "High"
                    },
                    {
                        "Key": "Application_Id",
                        "Value": "APP-001151"
                    },
                    {
                        "Key": "Approver",
                        "Value" : { "Ref" : "Approver" }
                    }
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
        },
        "MS238CPSQL03": {
            "Type": "AWS::EC2::Instance",
            "Properties": {
                "AvailabilityZone": "us-east-1c",
                "DisableApiTermination": "true",
                "ImageId": {
                    "Ref": "CommonAMI"
                },
                "InstanceType": "m3.xlarge",
                "KeyName": {
                    "Ref": "PemKey"
                },
                "SecurityGroupIds": [
                    {
                        "Ref": "CPDBSG"
                    },
                    {
                        "Ref": "NATCLIENT"
                    },"sg-42dc8b26"
                ],
                "SubnetId": {
                    "Ref": "Conf1c"
                },
                "Tags": [
                    {
                        "Key": "Name",
                        "Value": "ms238cpsql03"
                    },
                    {
                        "Key": "Application_Name",
                        "Value": "Cloud Pricing"
                    },
                    {
                        "Key": "Environment",
                        "Value": "Production"
                    },
                    {
                        "Key": "Security_Classification",
                        "Value": "Confidential"
                    },
                    {
                        "Key": "Cost_Center",
                        "Value" : { "Ref" : "CostCenter" }
                    },
                    {
                        "Key": "Owner",
                        "Value" : { "Ref" : "Owner" }
                    },
                    {
                        "Key": "System_Type",
                        "Value": " Database"
                    },
                    {
                        "Key": "Support_Criticality",
                        "Value": "High"
                    },
                    {
                        "Key": "Application_Id",
                        "Value": "APP-001151"
                    },
                    {
                        "Key": "Approver",
                        "Value" : { "Ref" : "Approver" }
                    }
                ]
            }
        },
        "MS238CPSQL04": {
            "Type": "AWS::EC2::Instance",
            "Properties": {
                "AvailabilityZone": "us-east-1d",
                "DisableApiTermination": "true",
                "ImageId": {
                    "Ref": "CommonAMI"
                },
                "InstanceType": "m3.xlarge",
                "KeyName": {
                    "Ref": "PemKey"
                },
                "SecurityGroupIds": [
                    {
                        "Ref": "CPDBSG"
                    },
                    {
                        "Ref": "NATCLIENT"
                    },"sg-42dc8b26"
                ],
                "SubnetId": {
                    "Ref": "Conf1d"
                },
                "Tags": [
                    {
                        "Key": "Name",
                        "Value": "ms238cpsql04"
                    },
                    {
                        "Key": "Application_Name",
                        "Value": "Cloud Pricing"
                    },
                    {
                        "Key": "Environment",
                        "Value": "Production"
                    },
                    {
                        "Key": "Security_Classification",
                        "Value": "Confidential"
                    },
                    {
                        "Key": "Cost_Center",
                        "Value" : { "Ref" : "CostCenter" }
                    },
                    {
                        "Key": "Owner",
                        "Value" : { "Ref" : "Owner" }
                    },
                    {
                        "Key": "System_Type",
                        "Value": " Database"
                    },
                    {
                        "Key": "Support_Criticality",
                        "Value": "High"
                    },
                    {
                        "Key": "Application_Id",
                        "Value": "APP-001151"
                    },
                    {
                        "Key": "Approver",
                        "Value" : { "Ref" : "Approver" }
                    }
                ]
            }
        },
        "MS238CPFS02": {
            "Type": "AWS::EC2::Instance",
            "Properties": {
                "AvailabilityZone": "us-east-1e",
                "DisableApiTermination": "true",
                "ImageId": {
                    "Ref": "CPFS01"
                },
                "InstanceType": "m3.large",
                "KeyName": {
                    "Ref": "PemKey"
                },
                "SecurityGroupIds": [
                    {
                        "Ref": "CPDBSG"
                    },
                    {
                        "Ref": "NATCLIENT"
                    },"sg-42dc8b26"
                ],
                "SubnetId": {
                    "Ref": "Conf1e"
                },
                "Tags": [
                    {
                        "Key": "Name",
                        "Value": "ms238cpfs02"
                    },
                    {
                        "Key": "Application_Name",
                        "Value": "Cloud Pricing"
                    },
                    {
                        "Key": "Environment",
                        "Value": "Production"
                    },
                    {
                        "Key": "Security_Classification",
                        "Value": "Confidential"
                    },
                    {
                        "Key": "Cost_Center",
                        "Value" : { "Ref" : "CostCenter" }
                    },
                    {
                        "Key": "Owner",
                        "Value" : { "Ref" : "Owner" }
                    },
                    {
                        "Key": "System_Type",
                        "Value": "Database"
                    },
                    {
                        "Key": "Support_Criticality",
                        "Value": "High"
                    },
                    {
                        "Key": "Application_Id",
                        "Value": "APP-001151"
                    },
                    {
                        "Key": "Approver",
                        "Value" : { "Ref" : "Approver" }
                    }
                ]
            }
        },
        "ADCELB": {
            "Type": "AWS::ElasticLoadBalancing::LoadBalancer",
            "Properties": {
                "Subnets": [
                    {
                        "Ref": "Conf1c"
                    },
                    {
                        "Ref": "Conf1d"
                    }
                ],
                "LoadBalancerName": "ac02-cp-prod-sysco",
                "Scheme": "internal",
                "SecurityGroups": [
                    {
                        "Ref": "CPWEBSG"
                    }
                ],
                "Instances": [
                    {
                        "Ref": "MS238CPAC03"
                    },
                    {
                        "Ref": "MS238CPAC04"
                    }
                ],
                "CrossZone": "true",
                "LBCookieStickinessPolicy": [
                    {
                        "PolicyName": "ACELB-Stickyness"
                    }
                ],
                "Listeners": [
                    {
                        "LoadBalancerPort": "80",
                        "InstancePort": "80",
                        "Protocol": "HTTP",
                        "PolicyNames": [
                            "ACELB-Stickyness"
                        ]
                    },
                    {
                        "LoadBalancerPort": "443",
                        "InstancePort": "80",
                        "Protocol": "HTTPS",
                        "SSLCertificateId": "arn:aws:iam::467936237394:server-certificate/Cloud-Pricing-Admin1",
                        "PolicyNames": [
                            "ACELB-Stickyness"
                        ]
                    }
                ],
                "HealthCheck": {
                    "Target": "HTTP:80/cloudpricingadmin/healthcheck",
                    "HealthyThreshold": "3",
                    "UnhealthyThreshold": "2",
                    "Interval": "30",
                    "Timeout": "5"
                },
                "AccessLoggingPolicy": {
                    "EmitInterval": "60",
                    "Enabled": "True",
                    "S3BucketName": "sysco-prod-log",
                    "S3BucketPrefix": "ELB"
                },
                "Tags": [
                    {
                        "Key": "Name",
                        "Value": "ws02-ac-prod-sysco"
                    },
                    {
                        "Key": "Application_Name",
                        "Value": "Cloud Pricing"
                    },
                    {
                        "Key": "Environment",
                        "Value": "Production"
                    },
                    {
                        "Key": "Security_Classification",
                        "Value": "Confidential"
                    },
                    {
                        "Key": "Cost_Center",
                        "Value" : { "Ref" : "CostCenter" }
                    },
                    {
                        "Key": "Owner",
                        "Value" : { "Ref" : "Owner" }
                    },
                    {
                        "Key": "System_Type",
                        "Value": "Load Balancer"
                    },
                    {
                        "Key": "Support_Criticality",
                        "Value": "High"
                    },
                    {
                        "Key": "Application_Id",
                        "Value": "APP-001151"
                    },
                    {
                        "Key": "Approver",
                        "Value" : { "Ref" : "Approver" }
                    }
                ]
            }
        },
        "MS238CPAC03": {
            "Type": "AWS::EC2::Instance",
            "Properties": {
                "AvailabilityZone": "us-east-1c",
                "DisableApiTermination": "true",
                "ImageId": {
                    "Ref": "CPAS03"
                },
                "InstanceType": "t2.micro",
                "KeyName": {
                    "Ref": "PemKey"
                },
                "SecurityGroupIds": [
                    {
                        "Ref": "CPWEBSG"
                    },
                    {
                        "Ref": "NATCLIENT"
                    },"sg-42dc8b26"
                ],
                "SubnetId": {
                    "Ref": "Conf1c"
                },
                "Tags": [
                    {
                        "Key": "Name",
                        "Value": "ms238cpac03"
                    },
                    {
                        "Key": "Application_Name",
                        "Value": "Cloud Pricing"
                    },
                    {
                        "Key": "Environment",
                        "Value": "Production"
                    },
                    {
                        "Key": "Security_Classification",
                        "Value": "Confidential"
                    },
                    {
                        "Key": "Cost_Center",
                        "Value" : { "Ref" : "CostCenter" }
                    },
                    {
                        "Key": "Owner",
                        "Value" : { "Ref" : "Owner" }
                    },
                    {
                        "Key": "System_Type",
                        "Value": "Application Server"
                    },
                    {
                        "Key": "Support_Criticality",
                        "Value": "Medium"
                    },
                    {
                        "Key": "Application_Id",
                        "Value": "APP-001151"
                    },
                    {
                        "Key": "Approver",
                        "Value" : { "Ref" : "Approver" }
                    }
                ],
                "UserData": {
                    "Fn::Base64": {
                        "Fn::Join": [
                            "",
                            [
                                "<powershell>\n",
                                "Rename-Computer -NewName ms238cpac03 -Restart\n",
                                "</powershell>"
                            ]
                        ]
                    }
                }
            }
        },
        "MS238CPAC04": {
            "Type": "AWS::EC2::Instance",
            "Properties": {
                "AvailabilityZone": "us-east-1d",
                "DisableApiTermination": "true",
                "ImageId": {
                    "Ref": "CPAS03"
                },
                "InstanceType": "t2.micro",
                "KeyName": {
                    "Ref": "PemKey"
                },
                "SecurityGroupIds": [
                    {
                        "Ref": "CPWEBSG"
                    },
                    {
                        "Ref": "NATCLIENT"
                    },"sg-42dc8b26"
                ],
                "SubnetId": {
                    "Ref": "Conf1d"
                },
                "Tags": [
                    {
                        "Key": "Name",
                        "Value": "ms238cpac04"
                    },
                    {
                        "Key": "Application_Name",
                        "Value": "Cloud Pricing"
                    },
                    {
                        "Key": "Environment",
                        "Value": "Production"
                    },
                    {
                        "Key": "Security_Classification",
                        "Value": "Confidential"
                    },
                    {
                        "Key": "Cost_Center",
                        "Value" : { "Ref" : "CostCenter" }
                    },
                    {
                        "Key": "Owner",
                        "Value" : { "Ref" : "Owner" }
                    },
                    {
                        "Key": "System_Type",
                        "Value": "Application Server"
                    },
                    {
                        "Key": "Support_Criticality",
                        "Value": "Medium"
                    },
                    {
                        "Key": "Application_Id",
                        "Value": "APP-001151"
                    },
                    {
                        "Key": "Approver",
                        "Value" : { "Ref" : "Approver" }
                    }
                ],
                "UserData": {
                    "Fn::Base64": {
                        "Fn::Join": [
                            "",
                            [
                                "<powershell>\n",
                                "Rename-Computer -NewName ms238cpac04 -Restart\n",
                                "</powershell>"
                            ]
                        ]
                    }
                }
            }
        },
        "ms238cpodsql03": {
            "Type": "AWS::EC2::Instance",
            "Properties": {
                "AvailabilityZone": "us-east-1c",
                "DisableApiTermination": "true",
                "ImageId": {
                    "Ref": "ODAMI"
                },
                "InstanceType": "m3.xlarge",
                "KeyName": {
                    "Ref": "PemKey"
                },
                "SecurityGroupIds": [
                    {
                        "Ref": "CPDBSG"
                    },
                    {
                        "Ref": "NATCLIENT"
                    },"sg-42dc8b26"
                ],
                "SubnetId": {
                    "Ref": "Conf1c"
                },
                "Tags": [
                    {
                        "Key": "Name",
                        "Value": "ms238cpodsql003"
                    },
                    {
                        "Key": "Application_Name",
                        "Value": "Cloud Pricing"
                    },
                    {
                        "Key": "Environment",
                        "Value": "Production"
                    },
                    {
                        "Key": "Security_Classification",
                        "Value": "Confidential"
                    },
                    {
                        "Key": "Cost_Center",
                        "Value" : { "Ref" : "CostCenter" }
                    },
                    {
                        "Key": "Owner",
                        "Value" : { "Ref" : "Owner" }
                    },
                    {
                        "Key": "System_Type",
                        "Value": " Database"
                    },
                    {
                        "Key": "Support_Criticality",
                        "Value": "Medium"
                    },
                    {
                        "Key": "Application_Id",
                        "Value": "APP-001151"
                    },
                    {
                        "Key": "Approver",
                        "Value" : { "Ref" : "Approver" }
                    }
                ],
                "UserData": {
                    "Fn::Base64": {
                        "Fn::Join": [
                            "",
                            [
                                "<powershell>\n",
                                "Rename-Computer -NewName ms238cpodsql003 -Restart\n",
                                "</powershell>"
                            ]
                        ]
                    }
                }
            }
        },
        "ms238cpodsql04": {
            "Type": "AWS::EC2::Instance",
            "Properties": {
                "AvailabilityZone": "us-east-1d",
                "DisableApiTermination": "true",
                "ImageId": {
                    "Ref": "ODAMI"
                },
                "InstanceType": "m3.xlarge",
                "KeyName": {
                    "Ref": "PemKey"
                },
                "SecurityGroupIds": [
                    {
                        "Ref": "CPDBSG"
                    },
                    {
                        "Ref": "NATCLIENT"
                    },"sg-42dc8b26"
                ],
                "SubnetId": {
                    "Ref": "Conf1d"
                },
                "Tags": [
                    {
                        "Key": "Name",
                        "Value": "ms238cpodsql004"
                    },
                    {
                        "Key": "Application_Name",
                        "Value": "Cloud Pricing"
                    },
                    {
                        "Key": "Environment",
                        "Value": "Production"
                    },
                    {
                        "Key": "Security_Classification",
                        "Value": "Confidential"
                    },
                    {
                        "Key": "Cost_Center",
                        "Value" : { "Ref" : "CostCenter" }
                    },
                    {
                        "Key": "Owner",
                        "Value" : { "Ref" : "Owner" }
                    },
                    {
                        "Key": "System_Type",
                        "Value": " Database"
                    },
                    {
                        "Key": "Support_Criticality",
                        "Value": "Medium"
                    },
                    {
                        "Key": "Application_Id",
                        "Value": "APP-001151"
                    },
                    {
                        "Key": "Approver",
                        "Value" : { "Ref" : "Approver" }
                    }
                ],
                "UserData": {
                    "Fn::Base64": {
                        "Fn::Join": [
                            "",
                            [
                                "<powershell>\n",
                                "Rename-Computer -NewName ms238cpodsql004 -Restart\n",
                                "</powershell>"
                            ]
                        ]
                    }
                }
            }
        },
        "ms238cpodsql05": {
            "Type": "AWS::EC2::Instance",
            "Properties": {
                "AvailabilityZone": "us-east-1c",
                "DisableApiTermination": "true",
                "ImageId": {
                    "Ref": "ODAMI"
                },
                "InstanceType": "m3.xlarge",
                "KeyName": {
                    "Ref": "PemKey"
                },
                "SecurityGroupIds": [
                    {
                        "Ref": "CPDBSG"
                    },
                    {
                        "Ref": "NATCLIENT"
                    },"sg-42dc8b26"
                ],
                "SubnetId": {
                    "Ref": "Conf1c"
                },
                "Tags": [
                    {
                        "Key": "Name",
                        "Value": "ms238cpodsql005"
                    },
                    {
                        "Key": "Application_Name",
                        "Value": "Cloud Pricing"
                    },
                    {
                        "Key": "Environment",
                        "Value": "Production"
                    },
                    {
                        "Key": "Security_Classification",
                        "Value": "Confidential"
                    },
                    {
                        "Key": "Cost_Center",
                        "Value" : { "Ref" : "CostCenter" }
                    },
                    {
                        "Key": "Owner",
                        "Value" : { "Ref" : "Owner" }
                    },
                    {
                        "Key": "System_Type",
                        "Value": " Database"
                    },
                    {
                        "Key": "Support_Criticality",
                        "Value": "Medium"
                    },
                    {
                        "Key": "Application_Id",
                        "Value": "APP-001151"
                    },
                    {
                        "Key": "Approver",
                        "Value" : { "Ref" : "Approver" }
                    }
                ],
                "UserData": {
                    "Fn::Base64": {
                        "Fn::Join": [
                            "",
                            [
                                "<powershell>\n",
                                "Rename-Computer -NewName ms238cpodsql005 -Restart\n",
                                "</powershell>"
                            ]
                        ]
                    }
                }
            }
        },
        "ms238cpodsql06": {
            "Type": "AWS::EC2::Instance",
            "Properties": {
                "AvailabilityZone": "us-east-1d",
                "DisableApiTermination": "true",
                "ImageId": {
                    "Ref": "ODAMI"
                },
                "InstanceType": "m3.xlarge",
                "KeyName": {
                    "Ref": "PemKey"
                },
                "SecurityGroupIds": [
                    {
                        "Ref": "CPDBSG"
                    },
                    {
                        "Ref": "NATCLIENT"
                    },"sg-42dc8b26"
                ],
                "SubnetId": {
                    "Ref": "Conf1d"
                },
                "Tags": [
                    {
                        "Key": "Name",
                        "Value": "ms238cpodsql006"
                    },
                    {
                        "Key": "Application_Name",
                        "Value": "Cloud Pricing"
                    },
                    {
                        "Key": "Environment",
                        "Value": "Production"
                    },
                    {
                        "Key": "Security_Classification",
                        "Value": "Confidential"
                    },
                    {
                        "Key": "Cost_Center",
                        "Value" : { "Ref" : "CostCenter" }
                    },
                    {
                        "Key": "Owner",
                        "Value" : { "Ref" : "Owner" }
                    },
                    {
                        "Key": "System_Type",
                        "Value": " Database"
                    },
                    {
                        "Key": "Support_Criticality",
                        "Value": "Medium"
                    },
                    {
                        "Key": "Application_Id",
                        "Value": "APP-001151"
                    },
                    {
                        "Key": "Approver",
                        "Value" : { "Ref" : "Approver" }
                    }
                ],
                "UserData": {
                    "Fn::Base64": {
                        "Fn::Join": [
                            "",
                            [
                                "<powershell>\n",
                                "Rename-Computer -NewName ms238cpodsql006 -Restart\n",
                                "</powershell>"
                            ]
                        ]
                    }
                }
            }
        },
        "ms238cpodsql07": {
            "Type": "AWS::EC2::Instance",
            "Properties": {
                "AvailabilityZone": "us-east-1c",
                "DisableApiTermination": "true",
                "ImageId": {
                    "Ref": "ODAMI"
                },
                "InstanceType": "m3.xlarge",
                "KeyName": {
                    "Ref": "PemKey"
                },
                "SecurityGroupIds": [
                    {
                        "Ref": "CPDBSG"
                    },
                    {
                        "Ref": "NATCLIENT"
                    },"sg-42dc8b26"
                ],
                "SubnetId": {
                    "Ref": "Conf1c"
                },
                "Tags": [
                    {
                        "Key": "Name",
                        "Value": "ms238cpodsql007"
                    },
                    {
                        "Key": "Application_Name",
                        "Value": "Cloud Pricing"
                    },
                    {
                        "Key": "Environment",
                        "Value": "Production"
                    },
                    {
                        "Key": "Security_Classification",
                        "Value": "Confidential"
                    },
                    {
                        "Key": "Cost_Center",
                        "Value" : { "Ref" : "CostCenter" }
                    },
                    {
                        "Key": "Owner",
                        "Value" : { "Ref" : "Owner" }
                    },
                    {
                        "Key": "System_Type",
                        "Value": " Database"
                    },
                    {
                        "Key": "Support_Criticality",
                        "Value": "Medium"
                    },
                    {
                        "Key": "Application_Id",
                        "Value": "APP-001151"
                    },
                    {
                        "Key": "Approver",
                        "Value" : { "Ref" : "Approver" }
                    }
                ],
                "UserData": {
                    "Fn::Base64": {
                        "Fn::Join": [
                            "",
                            [
                                "<powershell>\n",
                                "Rename-Computer -NewName ms238cpodsql007 -Restart\n",
                                "</powershell>"
                            ]
                        ]
                    }
                }
            }
        },
        "ms238cpodsql08": {
            "Type": "AWS::EC2::Instance",
            "Properties": {
                "AvailabilityZone": "us-east-1d",
                "DisableApiTermination": "true",
                "ImageId": {
                    "Ref": "ODAMI"
                },
                "InstanceType": "m3.xlarge",
                "KeyName": {
                    "Ref": "PemKey"
                },
                "SecurityGroupIds": [
                    {
                        "Ref": "CPDBSG"
                    },
                    {
                        "Ref": "NATCLIENT"
                    },"sg-42dc8b26"
                ],
                "SubnetId": {
                    "Ref": "Conf1d"
                },
                "Tags": [
                    {
                        "Key": "Name",
                        "Value": "ms238cpodsql008"
                    },
                    {
                        "Key": "Application_Name",
                        "Value": "Cloud Pricing"
                    },
                    {
                        "Key": "Environment",
                        "Value": "Production"
                    },
                    {
                        "Key": "Security_Classification",
                        "Value": "Confidential"
                    },
                    {
                        "Key": "Cost_Center",
                        "Value" : { "Ref" : "CostCenter" }
                    },
                    {
                        "Key": "Owner",
                        "Value" : { "Ref" : "Owner" }
                    },
                    {
                        "Key": "System_Type",
                        "Value": " Database"
                    },
                    {
                        "Key": "Support_Criticality",
                        "Value": "Medium"
                    },
                    {
                        "Key": "Application_Id",
                        "Value": "APP-001151"
                    },
                    {
                        "Key": "Approver",
                        "Value" : { "Ref" : "Approver" }
                    }
                ],
                "UserData": {
                    "Fn::Base64": {
                        "Fn::Join": [
                            "",
                            [
                                "<powershell>\n",
                                "Rename-Computer -NewName ms238cpodsql008 -Restart\n",
                                "</powershell>"
                            ]
                        ]
                    }
                }
            }
        },
        "ms238cpodsql09": {
            "Type": "AWS::EC2::Instance",
            "Properties": {
                "AvailabilityZone": "us-east-1c",
                "DisableApiTermination": "true",
                "ImageId": {
                    "Ref": "ODAMI"
                },
                "InstanceType": "m3.xlarge",
                "KeyName": {
                    "Ref": "PemKey"
                },
                "SecurityGroupIds": [
                    {
                        "Ref": "CPDBSG"
                    },
                    {
                        "Ref": "NATCLIENT"
                    },"sg-42dc8b26"
                ],
                "SubnetId": {
                    "Ref": "Conf1c"
                },
                "Tags": [
                    {
                        "Key": "Name",
                        "Value": "ms238cpodsql009"
                    },
                    {
                        "Key": "Application_Name",
                        "Value": "Cloud Pricing"
                    },
                    {
                        "Key": "Environment",
                        "Value": "Production"
                    },
                    {
                        "Key": "Security_Classification",
                        "Value": "Confidential"
                    },
                    {
                        "Key": "Cost_Center",
                        "Value" : { "Ref" : "CostCenter" }
                    },
                    {
                        "Key": "Owner",
                        "Value" : { "Ref" : "Owner" }
                    },
                    {
                        "Key": "System_Type",
                        "Value": " Database"
                    },
                    {
                        "Key": "Support_Criticality",
                        "Value": "Medium"
                    },
                    {
                        "Key": "Application_Id",
                        "Value": "APP-001151"
                    },
                    {
                        "Key": "Approver",
                        "Value" : { "Ref" : "Approver" }
                    }
                ],
                "UserData": {
                    "Fn::Base64": {
                        "Fn::Join": [
                            "",
                            [
                                "<powershell>\n",
                                "Rename-Computer -NewName ms238cpodsql009 -Restart\n",
                                "</powershell>"
                            ]
                        ]
                    }
                }
            }
        },
        "ms238cpodsql010": {
            "Type": "AWS::EC2::Instance",
            "Properties": {
                "AvailabilityZone": "us-east-1d",
                "DisableApiTermination": "true",
                "ImageId": {
                    "Ref": "ODAMI"
                },
                "InstanceType": "m3.xlarge",
                "KeyName": {
                    "Ref": "PemKey"
                },
                "SecurityGroupIds": [
                    {
                        "Ref": "CPDBSG"
                    },
                    {
                        "Ref": "NATCLIENT"
                    },"sg-42dc8b26"
                ],
                "SubnetId": {
                    "Ref": "Conf1d"
                },
                "Tags": [
                    {
                        "Key": "Name",
                        "Value": "ms238cpodsql010"
                    },
                    {
                        "Key": "Application_Name",
                        "Value": "Cloud Pricing"
                    },
                    {
                        "Key": "Environment",
                        "Value": "Production"
                    },
                    {
                        "Key": "Security_Classification",
                        "Value": "Confidential"
                    },
                    {
                        "Key": "Cost_Center",
                        "Value" : { "Ref" : "CostCenter" }
                    },
                    {
                        "Key": "Owner",
                        "Value" : { "Ref" : "Owner" }
                    },
                    {
                        "Key": "System_Type",
                        "Value": " Database"
                    },
                    {
                        "Key": "Support_Criticality",
                        "Value": "Medium"
                    },
                    {
                        "Key": "Application_Id",
                        "Value": "APP-001151"
                    },
                    {
                        "Key": "Approver",
                        "Value" : { "Ref" : "Approver" }
                    }
                ],
                "UserData": {
                    "Fn::Base64": {
                        "Fn::Join": [
                            "",
                            [
                                "<powershell>\n",
                                "Rename-Computer -NewName ms238cpodsql010 -Restart\n",
                                "</powershell>"
                            ]
                        ]
                    }
                }
            }
        },
        "ms238cpodsql011": {
            "Type": "AWS::EC2::Instance",
            "Properties": {
                "AvailabilityZone": "us-east-1c",
                "DisableApiTermination": "true",
                "ImageId": {
                    "Ref": "ODAMI"
                },
                "InstanceType": "m3.xlarge",
                "KeyName": {
                    "Ref": "PemKey"
                },
                "SecurityGroupIds": [
                    {
                        "Ref": "CPDBSG"
                    },
                    {
                        "Ref": "NATCLIENT"
                    },"sg-42dc8b26"
                ],
                "SubnetId": {
                    "Ref": "Conf1c"
                },
                "Tags": [
                    {
                        "Key": "Name",
                        "Value": "ms238cpodsql011"
                    },
                    {
                        "Key": "Application_Name",
                        "Value": "Cloud Pricing"
                    },
                    {
                        "Key": "Environment",
                        "Value": "Production"
                    },
                    {
                        "Key": "Security_Classification",
                        "Value": "Confidential"
                    },
                    {
                        "Key": "Cost_Center",
                        "Value" : { "Ref" : "CostCenter" }
                    },
                    {
                        "Key": "Owner",
                        "Value" : { "Ref" : "Owner" }
                    },
                    {
                        "Key": "System_Type",
                        "Value": " Database"
                    },
                    {
                        "Key": "Support_Criticality",
                        "Value": "Medium"
                    },
                    {
                        "Key": "Application_Id",
                        "Value": "APP-001151"
                    },
                    {
                        "Key": "Approver",
                        "Value" : { "Ref" : "Approver" }
                    }
                ],
                "UserData": {
                    "Fn::Base64": {
                        "Fn::Join": [
                            "",
                            [
                                "<powershell>\n",
                                "Rename-Computer -NewName ms238cpodsql011 -Restart\n",
                                "</powershell>"
                            ]
                        ]
                    }
                }
            }
        },
        "ms238cpodsql012": {
            "Type": "AWS::EC2::Instance",
            "Properties": {
                "AvailabilityZone": "us-east-1d",
                "DisableApiTermination": "true",
                "ImageId": {
                    "Ref": "ODAMI"
                },
                "InstanceType": "m3.xlarge",
                "KeyName": {
                    "Ref": "PemKey"
                },
                "SecurityGroupIds": [
                    {
                        "Ref": "CPDBSG"
                    },
                    {
                        "Ref": "NATCLIENT"
                    },"sg-42dc8b26"
                ],
                "SubnetId": {
                    "Ref": "Conf1d"
                },
                "Tags": [
                    {
                        "Key": "Name",
                        "Value": "ms238cpodsql012"
                    },
                    {
                        "Key": "Application_Name",
                        "Value": "Cloud Pricing"
                    },
                    {
                        "Key": "Environment",
                        "Value": "Production"
                    },
                    {
                        "Key": "Security_Classification",
                        "Value": "Confidential"
                    },
                    {
                        "Key": "Cost_Center",
                        "Value" : { "Ref" : "CostCenter" }
                    },
                    {
                        "Key": "Owner",
                        "Value" : { "Ref" : "Owner" }
                    },
                    {
                        "Key": "System_Type",
                        "Value": " Database"
                    },
                    {
                        "Key": "Support_Criticality",
                        "Value": "Medium"
                    },
                    {
                        "Key": "Application_Id",
                        "Value": "APP-001151"
                    },
                    {
                        "Key": "Approver",
                        "Value" : { "Ref" : "Approver" }
                    }
                ],
                "UserData": {
                    "Fn::Base64": {
                        "Fn::Join": [
                            "",
                            [
                                "<powershell>\n",
                                "Rename-Computer -NewName ms238cpodsql012 -Restart\n",
                                "</powershell>"
                            ]
                        ]
                    }
                }
            }
        },
        "ms238cpodsql013": {
            "Type": "AWS::EC2::Instance",
            "Properties": {
                "AvailabilityZone": "us-east-1c",
                "DisableApiTermination": "true",
                "ImageId": {
                    "Ref": "ODAMI"
                },
                "InstanceType": "m3.xlarge",
                "KeyName": {
                    "Ref": "PemKey"
                },
                "SecurityGroupIds": [
                    {
                        "Ref": "CPDBSG"
                    },
                    {
                        "Ref": "NATCLIENT"
                    },"sg-42dc8b26"
                ],
                "SubnetId": {
                    "Ref": "Conf1c"
                },
                "Tags": [
                    {
                        "Key": "Name",
                        "Value": "ms238cpodsql013"
                    },
                    {
                        "Key": "Application_Name",
                        "Value": "Cloud Pricing"
                    },
                    {
                        "Key": "Environment",
                        "Value": "Production"
                    },
                    {
                        "Key": "Security_Classification",
                        "Value": "Confidential"
                    },
                    {
                        "Key": "Cost_Center",
                        "Value" : { "Ref" : "CostCenter" }
                    },
                    {
                        "Key": "Owner",
                        "Value" : { "Ref" : "Owner" }
                    },
                    {
                        "Key": "System_Type",
                        "Value": " Database"
                    },
                    {
                        "Key": "Support_Criticality",
                        "Value": "Medium"
                    },
                    {
                        "Key": "Application_Id",
                        "Value": "APP-001151"
                    },
                    {
                        "Key": "Approver",
                        "Value" : { "Ref" : "Approver" }
                    }
                ],
                "UserData": {
                    "Fn::Base64": {
                        "Fn::Join": [
                            "",
                            [
                                "<powershell>\n",
                                "Rename-Computer -NewName ms238cpodsql013 -Restart\n",
                                "</powershell>"
                            ]
                        ]
                    }
                }
            }
        },
        "ms238cpodsql014": {
            "Type": "AWS::EC2::Instance",
            "Properties": {
                "AvailabilityZone": "us-east-1d",
                "DisableApiTermination": "true",
                "ImageId": {
                    "Ref": "ODAMI"
                },
                "InstanceType": "m3.xlarge",
                "KeyName": {
                    "Ref": "PemKey"
                },
                "SecurityGroupIds": [
                    {
                        "Ref": "CPDBSG"
                    },
                    {
                        "Ref": "NATCLIENT"
                    },"sg-42dc8b26"
                ],
                "SubnetId": {
                    "Ref": "Conf1d"
                },
                "Tags": [
                    {
                        "Key": "Name",
                        "Value": "ms238cpodsql014"
                    },
                    {
                        "Key": "Application_Name",
                        "Value": "Cloud Pricing"
                    },
                    {
                        "Key": "Environment",
                        "Value": "Production"
                    },
                    {
                        "Key": "Security_Classification",
                        "Value": "Confidential"
                    },
                    {
                        "Key": "Cost_Center",
                        "Value" : { "Ref" : "CostCenter" }
                    },
                    {
                        "Key": "Owner",
                        "Value" : { "Ref" : "Owner" }
                    },
                    {
                        "Key": "System_Type",
                        "Value": " Database"
                    },
                    {
                        "Key": "Support_Criticality",
                        "Value": "Medium"
                    },
                    {
                        "Key": "Application_Id",
                        "Value": "APP-001151"
                    },
                    {
                        "Key": "Approver",
                        "Value" : { "Ref" : "Approver" }
                    }
                ],
                "UserData": {
                    "Fn::Base64": {
                        "Fn::Join": [
                            "",
                            [
                                "<powershell>\n",
                                "Rename-Computer -NewName ms238cpodsql014 -Restart\n",
                                "</powershell>"
                            ]
                        ]
                    }
                }
            }
        },
		"ms238cpodsql015": {
            "Type": "AWS::EC2::Instance",
            "Properties": {
                "AvailabilityZone": "us-east-1c",
                "DisableApiTermination": "true",
				"IamInstanceProfile" : "Sysco-ApplicationDefaultInstanceProfile-47RRMF15XFMP",
                "ImageId": {
                    "Ref": "ODAMI"
                },
                "InstanceType": "m3.xlarge",
                "KeyName": {
                    "Ref": "PemKey"
                },
                "SecurityGroupIds": [
                    {
                        "Ref": "CPDBSG"
                    },
                    {
                        "Ref": "NATCLIENT"
                    },"sg-42dc8b26"
                ],
                "SubnetId": {
                    "Ref": "Conf1c"
                },
                "Tags": [
                    {
                        "Key": "Name",
                        "Value": "ms238cpodsql015"
                    },
                    {
                        "Key": "Application_Name",
                        "Value": "Cloud Pricing"
                    },
                    {
                        "Key": "Environment",
                        "Value": "Production"
                    },
                    {
                        "Key": "Security_Classification",
                        "Value": "Confidential"
                    },
                    {
                        "Key": "Cost_Center",
                        "Value" : { "Ref" : "CostCenter" }
                    },
                    {
                        "Key": "Owner",
                        "Value" : { "Ref" : "Owner" }
                    },
                    {
                        "Key": "System_Type",
                        "Value": " Database"
                    },
                    {
                        "Key": "Support_Criticality",
                        "Value": "Medium"
                    },
                    {
                        "Key": "Application_Id",
                        "Value": "APP-001151"
                    },
                    {
                        "Key": "Approver",
                        "Value" : { "Ref" : "Approver" }
                    }
                ],
                "UserData": {
                    "Fn::Base64": {
                        "Fn::Join": [
                            "",
                             [
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
		"ms238cpodsql016": {
            "Type": "AWS::EC2::Instance",
            "Properties": {
                "AvailabilityZone": "us-east-1d",
                "DisableApiTermination": "true",
				"IamInstanceProfile" : "Sysco-ApplicationDefaultInstanceProfile-47RRMF15XFMP",
                "ImageId": {
                    "Ref": "ODAMI"
                },
                "InstanceType": "m3.xlarge",
                "KeyName": {
                    "Ref": "PemKey"
                },
                "SecurityGroupIds": [
                    {
                        "Ref": "CPDBSG"
                    },
                    {
                        "Ref": "NATCLIENT"
                    },"sg-42dc8b26"
                ],
                "SubnetId": {
                    "Ref": "Conf1d"
                },
                "Tags": [
                    {
                        "Key": "Name",
                        "Value": "ms238cpodsql016"
                    },
                    {
                        "Key": "Application_Name",
                        "Value": "Cloud Pricing"
                    },
                    {
                        "Key": "Environment",
                        "Value": "Production"
                    },
                    {
                        "Key": "Security_Classification",
                        "Value": "Confidential"
                    },
                    {
                        "Key": "Cost_Center",
                        "Value" : { "Ref" : "CostCenter" }
                    },
                    {
                        "Key": "Owner",
                        "Value" : { "Ref" : "Owner" }
                    },
                    {
                        "Key": "System_Type",
                        "Value": " Database"
                    },
                    {
                        "Key": "Support_Criticality",
                        "Value": "Medium"
                    },
                    {
                        "Key": "Application_Id",
                        "Value": "APP-001151"
                    },
                    {
                        "Key": "Approver",
                        "Value" : { "Ref" : "Approver" }
                    }
                ],
                "UserData": {
                    "Fn::Base64": {
                        "Fn::Join": [
                            "",
                             [
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
		"ms238cpodsql017": {
            "Type": "AWS::EC2::Instance",
            "Properties": {
                "AvailabilityZone": "us-east-1d",
                "DisableApiTermination": "true",
				"IamInstanceProfile" : "Sysco-ApplicationDefaultInstanceProfile-47RRMF15XFMP",
                "ImageId": {
                    "Ref": "ODAMI"
                },
                "InstanceType": "m3.xlarge",
                "KeyName": {
                    "Ref": "PemKey"
                },
                "SecurityGroupIds": [
                    {
                        "Ref": "CPDBSG"
                    },
                    {
                        "Ref": "NATCLIENT"
                    },"sg-42dc8b26"
                ],
                "SubnetId": {
                    "Ref": "Conf1d"
                },
                "Tags": [
                    {
                        "Key": "Name",
                        "Value": "ms238cpodsql017"
                    },
                    {
                        "Key": "Application_Name",
                        "Value": "Cloud Pricing"
                    },
                    {
                        "Key": "Environment",
                        "Value": "Production"
                    },
                    {
                        "Key": "Security_Classification",
                        "Value": "Confidential"
                    },
                    {
                        "Key": "Cost_Center",
                        "Value" : { "Ref" : "CostCenter" }
                    },
                    {
                        "Key": "Owner",
                        "Value" : { "Ref" : "Owner" }
                    },
                    {
                        "Key": "System_Type",
                        "Value": " Database"
                    },
                    {
                        "Key": "Support_Criticality",
                        "Value": "Medium"
                    },
                    {
                        "Key": "Application_Id",
                        "Value": "APP-001151"
                    },
                    {
                        "Key": "Approver",
                        "Value" : { "Ref" : "Approver" }
                    }
                ],
                "UserData": {
                    "Fn::Base64": {
                        "Fn::Join": [
                            "",
                             [
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
		"ms238cpodsql018": {
            "Type": "AWS::EC2::Instance",
            "Properties": {
                "AvailabilityZone": "us-east-1d",
                "DisableApiTermination": "true",
				"IamInstanceProfile" : "Sysco-ApplicationDefaultInstanceProfile-47RRMF15XFMP",
                "ImageId": {
                    "Ref": "ODAMI"
                },
                "InstanceType": "m3.xlarge",
                "KeyName": {
                    "Ref": "PemKey"
                },
                "SecurityGroupIds": [
                    {
                        "Ref": "CPDBSG"
                    },
                    {
                        "Ref": "NATCLIENT"
                    },"sg-42dc8b26"
                ],
                "SubnetId": {
                    "Ref": "Conf1d"
                },
                "Tags": [
                    {
                        "Key": "Name",
                        "Value": "ms238cpodsql018"
                    },
                    {
                        "Key": "Application_Name",
                        "Value": "Cloud Pricing"
                    },
                    {
                        "Key": "Environment",
                        "Value": "Production"
                    },
                    {
                        "Key": "Security_Classification",
                        "Value": "Confidential"
                    },
                    {
                        "Key": "Cost_Center",
                        "Value" : { "Ref" : "CostCenter" }
                    },
                    {
                        "Key": "Owner",
                        "Value" : { "Ref" : "Owner" }
                    },
                    {
                        "Key": "System_Type",
                        "Value": " Database"
                    },
                    {
                        "Key": "Support_Criticality",
                        "Value": "Medium"
                    },
                    {
                        "Key": "Application_Id",
                        "Value": "APP-001151"
                    },
                    {
                        "Key": "Approver",
                        "Value" : { "Ref" : "Approver" }
                    }
                ],
                "UserData": {
                    "Fn::Base64": {
                        "Fn::Join": [
                            "",
                             [
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
		"ms238cpodsql019": {
            "Type": "AWS::EC2::Instance",
            "Properties": {
                "AvailabilityZone": "us-east-1d",
                "DisableApiTermination": "true",
				"IamInstanceProfile" : "Sysco-ApplicationDefaultInstanceProfile-47RRMF15XFMP",
                "ImageId": {
                    "Ref": "ODAMI"
                },
                "InstanceType": "m3.xlarge",
                "KeyName": {
                    "Ref": "PemKey"
                },
                "SecurityGroupIds": [
                    {
                        "Ref": "CPDBSG"
                    },
                    {
                        "Ref": "NATCLIENT"
                    },"sg-42dc8b26"
                ],
                "SubnetId": {
                    "Ref": "Conf1d"
                },
                "Tags": [
                    {
                        "Key": "Name",
                        "Value": "ms238cpodsql019"
                    },
                    {
                        "Key": "Application_Name",
                        "Value": "Cloud Pricing"
                    },
                    {
                        "Key": "Environment",
                        "Value": "Production"
                    },
                    {
                        "Key": "Security_Classification",
                        "Value": "Confidential"
                    },
                    {
                        "Key": "Cost_Center",
                        "Value" : { "Ref" : "CostCenter" }
                    },
                    {
                        "Key": "Owner",
                        "Value" : { "Ref" : "Owner" }
                    },
                    {
                        "Key": "System_Type",
                        "Value": " Database"
                    },
                    {
                        "Key": "Support_Criticality",
                        "Value": "Medium"
                    },
                    {
                        "Key": "Application_Id",
                        "Value": "APP-001151"
                    },
                    {
                        "Key": "Approver",
                        "Value" : { "Ref" : "Approver" }
                    }
                ],
                "UserData": {
                    "Fn::Base64": {
                        "Fn::Join": [
                            "",
                             [
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
		"ms238cpodsql020": {
            "Type": "AWS::EC2::Instance",
            "Properties": {
                "AvailabilityZone": "us-east-1d",
                "DisableApiTermination": "true",
				"IamInstanceProfile" : "Sysco-ApplicationDefaultInstanceProfile-47RRMF15XFMP",
                "ImageId": {
                    "Ref": "ODAMI"
                },
                "InstanceType": "m3.xlarge",
                "KeyName": {
                    "Ref": "PemKey"
                },
                "SecurityGroupIds": [
                    {
                        "Ref": "CPDBSG"
                    },
                    {
                        "Ref": "NATCLIENT"
                    },"sg-42dc8b26"
                ],
                "SubnetId": {
                    "Ref": "Conf1d"
                },
                "Tags": [
                    {
                        "Key": "Name",
                        "Value": "ms238cpodsql020"
                    },
                    {
                        "Key": "Application_Name",
                        "Value": "Cloud Pricing"
                    },
                    {
                        "Key": "Environment",
                        "Value": "Production"
                    },
                    {
                        "Key": "Security_Classification",
                        "Value": "Confidential"
                    },
                    {
                        "Key": "Cost_Center",
                        "Value" : { "Ref" : "CostCenter" }
                    },
                    {
                        "Key": "Owner",
                        "Value" : { "Ref" : "Owner" }
                    },
                    {
                        "Key": "System_Type",
                        "Value": " Database"
                    },
                    {
                        "Key": "Support_Criticality",
                        "Value": "Medium"
                    },
                    {
                        "Key": "Application_Id",
                        "Value": "APP-001151"
                    },
                    {
                        "Key": "Approver",
                        "Value" : { "Ref" : "Approver" }
                    }
                ],
                "UserData": {
                    "Fn::Base64": {
                        "Fn::Join": [
                            "",
                             [
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
                "AvailabilityZone": "us-east-1d",
                "DisableApiTermination": "true",
				"IamInstanceProfile" : "Sysco-ApplicationDefaultInstanceProfile-47RRMF15XFMP",
                "ImageId": {
                    "Ref": "ODAMI"
                },
                "InstanceType": "m3.xlarge",
                "KeyName": {
                    "Ref": "PemKey"
                },
                "SecurityGroupIds": [
                    {
                        "Ref": "CPDBSG"
                    },
                    {
                        "Ref": "NATCLIENT"
                    },"sg-42dc8b26"
                ],
                "SubnetId": {
                    "Ref": "Conf1d"
                },
                "Tags": [
                    {
                        "Key": "Name",
                        "Value": "ms238cpodsql001"
                    },
                    {
                        "Key": "Application_Name",
                        "Value": "Cloud Pricing"
                    },
                    {
                        "Key": "Environment",
                        "Value": "Production"
                    },
                    {
                        "Key": "Security_Classification",
                        "Value": "Confidential"
                    },
                    {
                        "Key": "Cost_Center",
                        "Value" : { "Ref" : "CostCenter" }
                    },
                    {
                        "Key": "Owner",
                        "Value" : { "Ref" : "Owner" }
                    },
                    {
                        "Key": "System_Type",
                        "Value": " Database"
                    },
                    {
                        "Key": "Support_Criticality",
                        "Value": "Medium"
                    },
                    {
                        "Key": "Application_Id",
                        "Value": "APP-001151"
                    },
                    {
                        "Key": "Approver",
                        "Value" : { "Ref" : "Approver" }
                    }
                ],
                "UserData": {
                    "Fn::Base64": {
                        "Fn::Join": [
                            "",
                             [
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
		"ms238cpodsql002": {
            "Type": "AWS::EC2::Instance",
            "Properties": {
                "AvailabilityZone": "us-east-1d",
                "DisableApiTermination": "true",
				"IamInstanceProfile" : "Sysco-ApplicationDefaultInstanceProfile-47RRMF15XFMP",
                "ImageId": {
                    "Ref": "ODAMI"
                },
                "InstanceType": "m3.xlarge",
                "KeyName": {
                    "Ref": "PemKey"
                },
                "SecurityGroupIds": [
                    {
                        "Ref": "CPDBSG"
                    },
                    {
                        "Ref": "NATCLIENT"
                    },"sg-42dc8b26"
                ],
                "SubnetId": {
                    "Ref": "Conf1d"
                },
                "Tags": [
                    {
                        "Key": "Name",
                        "Value": "ms238cpodsql002"
                    },
                    {
                        "Key": "Application_Name",
                        "Value": "Cloud Pricing"
                    },
                    {
                        "Key": "Environment",
                        "Value": "Production"
                    },
                    {
                        "Key": "Security_Classification",
                        "Value": "Confidential"
                    },
                    {
                        "Key": "Cost_Center",
                        "Value" : { "Ref" : "CostCenter" }
                    },
                    {
                        "Key": "Owner",
                        "Value" : { "Ref" : "Owner" }
                    },
                    {
                        "Key": "System_Type",
                        "Value": " Database"
                    },
                    {
                        "Key": "Support_Criticality",
                        "Value": "Medium"
                    },
                    {
                        "Key": "Application_Id",
                        "Value": "APP-001151"
                    },
                    {
                        "Key": "Approver",
                        "Value" : { "Ref" : "Approver" }
                    }
                ],
                "UserData": {
                    "Fn::Base64": {
                        "Fn::Join": [
                            "",
                             [
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
        "ms238cpbtsql03": {
            "Type": "AWS::EC2::Instance",
            "Properties": {
                "AvailabilityZone": "us-east-1c",
                "DisableApiTermination": "true",
                "ImageId": {
                    "Ref": "BTAMI"
                },
                "InstanceType": "m3.xlarge",
                "KeyName": {
                    "Ref": "PemKey"
                },
                "SecurityGroupIds": [
                    {
                        "Ref": "CPDBSG"
                    },
                    {
                        "Ref": "NATCLIENT"
                    },"sg-42dc8b26"
                ],
                "SubnetId": {
                    "Ref": "Conf1c"
                },
                "Tags": [
                    {
                        "Key": "Name",
                        "Value": "ms238cpbtsql003"
                    },
                    {
                        "Key": "Application_Name",
                        "Value": "Cloud Pricing"
                    },
                    {
                        "Key": "Environment",
                        "Value": "Production"
                    },
                    {
                        "Key": "Security_Classification",
                        "Value": "Confidential"
                    },
                    {
                        "Key": "Cost_Center",
                        "Value" : { "Ref" : "CostCenter" }
                    },
                    {
                        "Key": "Owner",
                        "Value" : { "Ref" : "Owner" }
                    },
                    {
                        "Key": "System_Type",
                        "Value": " Database"
                    },
                    {
                        "Key": "Support_Criticality",
                        "Value": "Medium"
                    },
                    {
                        "Key": "Application_Id",
                        "Value": "APP-001151"
                    },
                    {
                        "Key": "Approver",
                        "Value" : { "Ref" : "Approver" }
                    }
                ],
                "UserData": {
                    "Fn::Base64": {
                        "Fn::Join": [
                            "",
                            [
                                "<powershell>\n",
                                "Rename-Computer -NewName ms238cpbtsql003 -Restart\n",
                                "</powershell>"
                            ]
                        ]
                    }
                }
            }
        },
        "ms238cpbtsql04": {
            "Type": "AWS::EC2::Instance",
            "Properties": {
                "AvailabilityZone": "us-east-1d",
                "DisableApiTermination": "true",
                "ImageId": {
                    "Ref": "BTAMI"
                },
                "InstanceType": "m3.xlarge",
                "KeyName": {
                    "Ref": "PemKey"
                },
                "SecurityGroupIds": [
                    {
                        "Ref": "CPDBSG"
                    },
                    {
                        "Ref": "NATCLIENT"
                    },"sg-42dc8b26"
                ],
                "SubnetId": {
                    "Ref": "Conf1d"
                },
                "Tags": [
                    {
                        "Key": "Name",
                        "Value": "ms238cpbtsql004"
                    },
                    {
                        "Key": "Application_Name",
                        "Value": "Cloud Pricing"
                    },
                    {
                        "Key": "Environment",
                        "Value": "Production"
                    },
                    {
                        "Key": "Security_Classification",
                        "Value": "Confidential"
                    },
                    {
                        "Key": "Cost_Center",
                        "Value" : { "Ref" : "CostCenter" }
                    },
                    {
                        "Key": "Owner",
                        "Value" : { "Ref" : "Owner" }
                    },
                    {
                        "Key": "System_Type",
                        "Value": " Database"
                    },
                    {
                        "Key": "Support_Criticality",
                        "Value": "Medium"
                    },
                    {
                        "Key": "Application_Id",
                        "Value": "APP-001151"
                    },
                    {
                        "Key": "Approver",
                        "Value" : { "Ref" : "Approver" }
                    }
                ],
                "UserData": {
                    "Fn::Base64": {
                        "Fn::Join": [
                            "",
                            [
                                "<powershell>\n",
                                "Rename-Computer -NewName ms238cpbtsql004 -Restart\n",
                                "</powershell>"
                            ]
                        ]
                    }
                }
            }
        },
        "ms238cpbtsql05": {
            "Type": "AWS::EC2::Instance",
            "Properties": {
                "AvailabilityZone": "us-east-1c",
                "DisableApiTermination": "true",
                "ImageId": {
                    "Ref": "BTAMI"
                },
                "InstanceType": "m3.xlarge",
                "KeyName": {
                    "Ref": "PemKey"
                },
                "SecurityGroupIds": [
                    {
                        "Ref": "CPDBSG"
                    },
                    {
                        "Ref": "NATCLIENT"
                    },"sg-42dc8b26"
                ],
                "SubnetId": {
                    "Ref": "Conf1c"
                },
                "Tags": [
                    {
                        "Key": "Name",
                        "Value": "ms238cpbtsql005"
                    },
                    {
                        "Key": "Application_Name",
                        "Value": "Cloud Pricing"
                    },
                    {
                        "Key": "Environment",
                        "Value": "Production"
                    },
                    {
                        "Key": "Security_Classification",
                        "Value": "Confidential"
                    },
                    {
                        "Key": "Cost_Center",
                        "Value" : { "Ref" : "CostCenter" }
                    },
                    {
                        "Key": "Owner",
                        "Value" : { "Ref" : "Owner" }
                    },
                    {
                        "Key": "System_Type",
                        "Value": " Database"
                    },
                    {
                        "Key": "Support_Criticality",
                        "Value": "Medium"
                    },
                    {
                        "Key": "Application_Id",
                        "Value": "APP-001151"
                    },
                    {
                        "Key": "Approver",
                        "Value" : { "Ref" : "Approver" }
                    }
                ],
                "UserData": {
                    "Fn::Base64": {
                        "Fn::Join": [
                            "",
                            [
                                "<powershell>\n",
                                "Rename-Computer -NewName ms238cpbtsql005 -Restart\n",
                                "</powershell>"
                            ]
                        ]
                    }
                }
            }
        },
        "ms238cpbtsql06": {
            "Type": "AWS::EC2::Instance",
            "Properties": {
                "AvailabilityZone": "us-east-1d",
                "DisableApiTermination": "true",
                "ImageId": {
                    "Ref": "BTAMI"
                },
                "InstanceType": "m3.xlarge",
                "KeyName": {
                    "Ref": "PemKey"
                },
                "SecurityGroupIds": [
                    {
                        "Ref": "CPDBSG"
                    },
                    {
                        "Ref": "NATCLIENT"
                    },"sg-42dc8b26"
                ],
                "SubnetId": {
                    "Ref": "Conf1d"
                },
                "Tags": [
                    {
                        "Key": "Name",
                        "Value": "ms238cpbtsql006"
                    },
                    {
                        "Key": "Application_Name",
                        "Value": "Cloud Pricing"
                    },
                    {
                        "Key": "Environment",
                        "Value": "Production"
                    },
                    {
                        "Key": "Security_Classification",
                        "Value": "Confidential"
                    },
                    {
                        "Key": "Cost_Center",
                        "Value" : { "Ref" : "CostCenter" }
                    },
                    {
                        "Key": "Owner",
                        "Value" : { "Ref" : "Owner" }
                    },
                    {
                        "Key": "System_Type",
                        "Value": " Database"
                    },
                    {
                        "Key": "Support_Criticality",
                        "Value": "Medium"
                    },
                    {
                        "Key": "Application_Id",
                        "Value": "APP-001151"
                    },
                    {
                        "Key": "Approver",
                        "Value" : { "Ref" : "Approver" }
                    }
                ],
                "UserData": {
                    "Fn::Base64": {
                        "Fn::Join": [
                            "",
                            [
                                "<powershell>\n",
                                "Rename-Computer -NewName ms238cpbtsql006 -Restart\n",
                                "</powershell>"
                            ]
                        ]
                    }
                }
            }
        },
        "ms238cpbtsql07": {
            "Type": "AWS::EC2::Instance",
            "Properties": {
                "AvailabilityZone": "us-east-1c",
                "DisableApiTermination": "true",
                "ImageId": {
                    "Ref": "BTAMI"
                },
                "InstanceType": "m3.xlarge",
                "KeyName": {
                    "Ref": "PemKey"
                },
                "SecurityGroupIds": [
                    {
                        "Ref": "CPDBSG"
                    },
                    {
                        "Ref": "NATCLIENT"
                    },"sg-42dc8b26"
                ],
                "SubnetId": {
                    "Ref": "Conf1c"
                },
                "Tags": [
                    {
                        "Key": "Name",
                        "Value": "ms238cpbtsql007"
                    },
                    {
                        "Key": "Application_Name",
                        "Value": "Cloud Pricing"
                    },
                    {
                        "Key": "Environment",
                        "Value": "Production"
                    },
                    {
                        "Key": "Security_Classification",
                        "Value": "Confidential"
                    },
                    {
                        "Key": "Cost_Center",
                        "Value" : { "Ref" : "CostCenter" }
                    },
                    {
                        "Key": "Owner",
                        "Value" : { "Ref" : "Owner" }
                    },
                    {
                        "Key": "System_Type",
                        "Value": " Database"
                    },
                    {
                        "Key": "Support_Criticality",
                        "Value": "Medium"
                    },
                    {
                        "Key": "Application_Id",
                        "Value": "APP-001151"
                    },
                    {
                        "Key": "Approver",
                        "Value" : { "Ref" : "Approver" }
                    }
                ],
                "UserData": {
                    "Fn::Base64": {
                        "Fn::Join": [
                            "",
                            [
                                "<powershell>\n",
                                "Rename-Computer -NewName ms238cpbtsql007 -Restart\n",
                                "</powershell>"
                            ]
                        ]
                    }
                }
            }
        },
        "ms238cpbtsql08": {
            "Type": "AWS::EC2::Instance",
            "Properties": {
                "AvailabilityZone": "us-east-1d",
                "DisableApiTermination": "true",
                "ImageId": {
                    "Ref": "BTAMI"
                },
                "InstanceType": "m3.xlarge",
                "KeyName": {
                    "Ref": "PemKey"
                },
                "SecurityGroupIds": [
                    {
                        "Ref": "CPDBSG"
                    },
                    {
                        "Ref": "NATCLIENT"
                    },"sg-42dc8b26"
                ],
                "SubnetId": {
                    "Ref": "Conf1d"
                },
                "Tags": [
                    {
                        "Key": "Name",
                        "Value": "ms238cpbtsql008"
                    },
                    {
                        "Key": "Application_Name",
                        "Value": "Cloud Pricing"
                    },
                    {
                        "Key": "Environment",
                        "Value": "Production"
                    },
                    {
                        "Key": "Security_Classification",
                        "Value": "Confidential"
                    },
                    {
                        "Key": "Cost_Center",
                        "Value" : { "Ref" : "CostCenter" }
                    },
                    {
                        "Key": "Owner",
                        "Value" : { "Ref" : "Owner" }
                    },
                    {
                        "Key": "System_Type",
                        "Value": " Database"
                    },
                    {
                        "Key": "Support_Criticality",
                        "Value": "Medium"
                    },
                    {
                        "Key": "Application_Id",
                        "Value": "APP-001151"
                    },
                    {
                        "Key": "Approver",
                        "Value" : { "Ref" : "Approver" }
                    }
                ],
                "UserData": {
                    "Fn::Base64": {
                        "Fn::Join": [
                            "",
                            [
                                "<powershell>\n",
                                "Rename-Computer -NewName ms238cpbtsql008 -Restart\n",
                                "</powershell>"
                            ]
                        ]
                    }
                }
            }
        },
        "ms238cpbtsql09": {
            "Type": "AWS::EC2::Instance",
            "Properties": {
                "AvailabilityZone": "us-east-1c",
                "DisableApiTermination": "true",
                "ImageId": {
                    "Ref": "BTAMI"
                },
                "InstanceType": "m3.xlarge",
                "KeyName": {
                    "Ref": "PemKey"
                },
                "SecurityGroupIds": [
                    {
                        "Ref": "CPDBSG"
                    },
                    {
                        "Ref": "NATCLIENT"
                    },"sg-42dc8b26"
                ],
                "SubnetId": {
                    "Ref": "Conf1c"
                },
                "Tags": [
                    {
                        "Key": "Name",
                        "Value": "ms238cpbtsql009"
                    },
                    {
                        "Key": "Application_Name",
                        "Value": "Cloud Pricing"
                    },
                    {
                        "Key": "Environment",
                        "Value": "Production"
                    },
                    {
                        "Key": "Security_Classification",
                        "Value": "Confidential"
                    },
                    {
                        "Key": "Cost_Center",
                        "Value" : { "Ref" : "CostCenter" }
                    },
                    {
                        "Key": "Owner",
                        "Value" : { "Ref" : "Owner" }
                    },
                    {
                        "Key": "System_Type",
                        "Value": " Database"
                    },
                    {
                        "Key": "Support_Criticality",
                        "Value": "Medium"
                    },
                    {
                        "Key": "Application_Id",
                        "Value": "APP-001151"
                    },
                    {
                        "Key": "Approver",
                        "Value" : { "Ref" : "Approver" }
                    }
                ],
                "UserData": {
                    "Fn::Base64": {
                        "Fn::Join": [
                            "",
                            [
                                "<powershell>\n",
                                "Rename-Computer -NewName ms238cpbtsql009 -Restart\n",
                                "</powershell>"
                            ]
                        ]
                    }
                }
            }
        },
        "ms238cpbtsql010": {
            "Type": "AWS::EC2::Instance",
            "Properties": {
                "AvailabilityZone": "us-east-1d",
                "DisableApiTermination": "true",
                "ImageId": {
                    "Ref": "BTAMI"
                },
                "InstanceType": "m3.xlarge",
                "KeyName": {
                    "Ref": "PemKey"
                },
                "SecurityGroupIds": [
                    {
                        "Ref": "CPDBSG"
                    },
                    {
                        "Ref": "NATCLIENT"
                    },"sg-42dc8b26"
                ],
                "SubnetId": {
                    "Ref": "Conf1d"
                },
                "Tags": [
                    {
                        "Key": "Name",
                        "Value": "ms238cpbtsql010"
                    },
                    {
                        "Key": "Application_Name",
                        "Value": "Cloud Pricing"
                    },
                    {
                        "Key": "Environment",
                        "Value": "Production"
                    },
                    {
                        "Key": "Security_Classification",
                        "Value": "Confidential"
                    },
                    {
                        "Key": "Cost_Center",
                        "Value" : { "Ref" : "CostCenter" }
                    },
                    {
                        "Key": "Owner",
                        "Value" : { "Ref" : "Owner" }
                    },
                    {
                        "Key": "System_Type",
                        "Value": " Database"
                    },
                    {
                        "Key": "Support_Criticality",
                        "Value": "Medium"
                    },
                    {
                        "Key": "Application_Id",
                        "Value": "APP-001151"
                    },
                    {
                        "Key": "Approver",
                        "Value" : { "Ref" : "Approver" }
                    }
                ],
                "UserData": {
                    "Fn::Base64": {
                        "Fn::Join": [
                            "",
                            [
                                "<powershell>\n",
                                "Rename-Computer -NewName ms238cpbtsql010 -Restart\n",
                                "</powershell>"
                            ]
                        ]
                    }
                }
            }
        },
        "ms238cpbtsql011": {
            "Type": "AWS::EC2::Instance",
            "Properties": {
                "AvailabilityZone": "us-east-1c",
                "DisableApiTermination": "true",
                "ImageId": {
                    "Ref": "BTAMI"
                },
                "InstanceType": "m3.xlarge",
                "KeyName": {
                    "Ref": "PemKey"
                },
                "SecurityGroupIds": [
                    {
                        "Ref": "CPDBSG"
                    },
                    {
                        "Ref": "NATCLIENT"
                    },"sg-42dc8b26"
                ],
                "SubnetId": {
                    "Ref": "Conf1c"
                },
                "Tags": [
                    {
                        "Key": "Name",
                        "Value": "ms238cpbtsql011"
                    },
                    {
                        "Key": "Application_Name",
                        "Value": "Cloud Pricing"
                    },
                    {
                        "Key": "Environment",
                        "Value": "Production"
                    },
                    {
                        "Key": "Security_Classification",
                        "Value": "Confidential"
                    },
                    {
                        "Key": "Cost_Center",
                        "Value" : { "Ref" : "CostCenter" }
                    },
                    {
                        "Key": "Owner",
                        "Value" : { "Ref" : "Owner" }
                    },
                    {
                        "Key": "System_Type",
                        "Value": " Database"
                    },
                    {
                        "Key": "Support_Criticality",
                        "Value": "Medium"
                    },
                    {
                        "Key": "Application_Id",
                        "Value": "APP-001151"
                    },
                    {
                        "Key": "Approver",
                        "Value" : { "Ref" : "Approver" }
                    }
                ],
                "UserData": {
                    "Fn::Base64": {
                        "Fn::Join": [
                            "",
                            [
                                "<powershell>\n",
                                "Rename-Computer -NewName ms238cpbtsql011 -Restart\n",
                                "</powershell>"
                            ]
                        ]
                    }
                }
            }
        },
        "ms238cpbtsql012": {
            "Type": "AWS::EC2::Instance",
            "Properties": {
                "AvailabilityZone": "us-east-1d",
                "DisableApiTermination": "true",
                "ImageId": {
                    "Ref": "BTAMI"
                },
                "InstanceType": "m3.xlarge",
                "KeyName": {
                    "Ref": "PemKey"
                },
                "SecurityGroupIds": [
                    {
                        "Ref": "CPDBSG"
                    },
                    {
                        "Ref": "NATCLIENT"
                    },"sg-42dc8b26"
                ],
                "SubnetId": {
                    "Ref": "Conf1d"
                },
                "Tags": [
                    {
                        "Key": "Name",
                        "Value": "ms238cpbtsql012"
                    },
                    {
                        "Key": "Application_Name",
                        "Value": "Cloud Pricing"
                    },
                    {
                        "Key": "Environment",
                        "Value": "Production"
                    },
                    {
                        "Key": "Security_Classification",
                        "Value": "Confidential"
                    },
                    {
                        "Key": "Cost_Center",
                        "Value" : { "Ref" : "CostCenter" }
                    },
                    {
                        "Key": "Owner",
                        "Value" : { "Ref" : "Owner" }
                    },
                    {
                        "Key": "System_Type",
                        "Value": " Database"
                    },
                    {
                        "Key": "Support_Criticality",
                        "Value": "Medium"
                    },
                    {
                        "Key": "Application_Id",
                        "Value": "APP-001151"
                    },
                    {
                        "Key": "Approver",
                        "Value" : { "Ref" : "Approver" }
                    }
                ],
                "UserData": {
                    "Fn::Base64": {
                        "Fn::Join": [
                            "",
                            [
                                "<powershell>\n",
                                "Rename-Computer -NewName ms238cpbtsql012 -Restart\n",
                                "</powershell>"
                            ]
                        ]
                    }
                }
            }
        },
        "ms238cpbtsql013": {
            "Type": "AWS::EC2::Instance",
            "Properties": {
                "AvailabilityZone": "us-east-1c",
                "DisableApiTermination": "true",
                "ImageId": {
                    "Ref": "BTAMI"
                },
                "InstanceType": "m3.xlarge",
                "KeyName": {
                    "Ref": "PemKey"
                },
                "SecurityGroupIds": [
                    {
                        "Ref": "CPDBSG"
                    },
                    {
                        "Ref": "NATCLIENT"
                    },"sg-42dc8b26"
                ],
                "SubnetId": {
                    "Ref": "Conf1c"
                },
                "Tags": [
                    {
                        "Key": "Name",
                        "Value": "ms238cpbtsql013"
                    },
                    {
                        "Key": "Application_Name",
                        "Value": "Cloud Pricing"
                    },
                    {
                        "Key": "Environment",
                        "Value": "Production"
                    },
                    {
                        "Key": "Security_Classification",
                        "Value": "Confidential"
                    },
                    {
                        "Key": "Cost_Center",
                        "Value" : { "Ref" : "CostCenter" }
                    },
                    {
                        "Key": "Owner",
                        "Value" : { "Ref" : "Owner" }
                    },
                    {
                        "Key": "System_Type",
                        "Value": " Database"
                    },
                    {
                        "Key": "Support_Criticality",
                        "Value": "Medium"
                    },
                    {
                        "Key": "Application_Id",
                        "Value": "APP-001151"
                    },
                    {
                        "Key": "Approver",
                        "Value" : { "Ref" : "Approver" }
                    }
                ],
                "UserData": {
                    "Fn::Base64": {
                        "Fn::Join": [
                            "",
                            [
                                "<powershell>\n",
                                "Rename-Computer -NewName ms238cpbtsql013 -Restart\n",
                                "</powershell>"
                            ]
                        ]
                    }
                }
            }
        },
        "ms238cpbtsql014": {
            "Type": "AWS::EC2::Instance",
            "Properties": {
                "AvailabilityZone": "us-east-1d",
                "DisableApiTermination": "true",
                "ImageId": {
                    "Ref": "BTAMI"
                },
                "InstanceType": "m3.xlarge",
                "KeyName": {
                    "Ref": "PemKey"
                },
                "SecurityGroupIds": [
                    {
                        "Ref": "CPDBSG"
                    },
                    {
                        "Ref": "NATCLIENT"
                    },"sg-42dc8b26"
                ],
                "SubnetId": {
                    "Ref": "Conf1d"
                },
                "Tags": [
                    {
                        "Key": "Name",
                        "Value": "ms238cpbtsql014"
                    },
                    {
                        "Key": "Application_Name",
                        "Value": "Cloud Pricing"
                    },
                    {
                        "Key": "Environment",
                        "Value": "Production"
                    },
                    {
                        "Key": "Security_Classification",
                        "Value": "Confidential"
                    },
                    {
                        "Key": "Cost_Center",
                        "Value" : { "Ref" : "CostCenter" }
                    },
                    {
                        "Key": "Owner",
                        "Value" : { "Ref" : "Owner" }
                    },
                    {
                        "Key": "System_Type",
                        "Value": " Database"
                    },
                    {
                        "Key": "Support_Criticality",
                        "Value": "Medium"
                    },
                    {
                        "Key": "Application_Id",
                        "Value": "APP-001151"
                    },
                    {
                        "Key": "Approver",
                        "Value" : { "Ref" : "Approver" }
                    }
                ],
                "UserData": {
                    "Fn::Base64": {
                        "Fn::Join": [
                            "",
                            [
                                "<powershell>\n",
                                "Rename-Computer -NewName ms238cpbtsql014 -Restart\n",
                                "</powershell>"
                            ]
                        ]
                    }
                }
            }
        },
        "ms238cpbtsql015": {
            "Type": "AWS::EC2::Instance",
            "Properties": {
                "AvailabilityZone": "us-east-1c",
                "DisableApiTermination": "true",
                "ImageId": {
                    "Ref": "BTAMI"
                },
                "InstanceType": "m3.xlarge",
                "KeyName": {
                    "Ref": "PemKey"
                },
                "SecurityGroupIds": [
                    {
                        "Ref": "CPDBSG"
                    },
                    {
                        "Ref": "NATCLIENT"
                    },"sg-42dc8b26"
                ],
                "SubnetId": {
                    "Ref": "Conf1c"
                },
                "Tags": [
                    {
                        "Key": "Name",
                        "Value": "ms238cpbtsql015"
                    },
                    {
                        "Key": "Application_Name",
                        "Value": "Cloud Pricing"
                    },
                    {
                        "Key": "Environment",
                        "Value": "Production"
                    },
                    {
                        "Key": "Security_Classification",
                        "Value": "Confidential"
                    },
                    {
                        "Key": "Cost_Center",
                        "Value" : { "Ref" : "CostCenter" }
                    },
                    {
                        "Key": "Owner",
                        "Value" : { "Ref" : "Owner" }
                    },
                    {
                        "Key": "System_Type",
                        "Value": " Database"
                    },
                    {
                        "Key": "Support_Criticality",
                        "Value": "Medium"
                    },
                    {
                        "Key": "Application_Id",
                        "Value": "APP-001151"
                    },
                    {
                        "Key": "Approver",
                        "Value" : { "Ref" : "Approver" }
                    }
                ],
                "UserData": {
                    "Fn::Base64": {
                        "Fn::Join": [
                            "",
                            [
                                "<powershell>\n",
                                "Rename-Computer -NewName ms238cpbtsql015 -Restart\n",
                                "</powershell>"
                            ]
                        ]
                    }
                }
            }
        },
        "ms238cpbtsql016": {
            "Type": "AWS::EC2::Instance",
            "Properties": {
                "AvailabilityZone": "us-east-1d",
                "DisableApiTermination": "true",
                "ImageId": {
                    "Ref": "BTAMI"
                },
                "InstanceType": "m3.xlarge",
                "KeyName": {
                    "Ref": "PemKey"
                },
                "SecurityGroupIds": [
                    {
                        "Ref": "CPDBSG"
                    },
                    {
                        "Ref": "NATCLIENT"
                    },"sg-42dc8b26"
                ],
                "SubnetId": {
                    "Ref": "Conf1d"
                },
                "Tags": [
                    {
                        "Key": "Name",
                        "Value": "ms238cpbtsql016"
                    },
                    {
                        "Key": "Application_Name",
                        "Value": "Cloud Pricing"
                    },
                    {
                        "Key": "Environment",
                        "Value": "Production"
                    },
                    {
                        "Key": "Security_Classification",
                        "Value": "Confidential"
                    },
                    {
                        "Key": "Cost_Center",
                        "Value" : { "Ref" : "CostCenter" }
                    },
                    {
                        "Key": "Owner",
                        "Value" : { "Ref" : "Owner" }
                    },
                    {
                        "Key": "System_Type",
                        "Value": " Database"
                    },
                    {
                        "Key": "Support_Criticality",
                        "Value": "Medium"
                    },
                    {
                        "Key": "Application_Id",
                        "Value": "APP-001151"
                    },
                    {
                        "Key": "Approver",
                        "Value" : { "Ref" : "Approver" }
                    }
                ],
                "UserData": {
                    "Fn::Base64": {
                        "Fn::Join": [
                            "",
                            [
                                "<powershell>\n",
                                "Rename-Computer -NewName ms238cpbtsql016 -Restart\n",
                                "</powershell>"
                            ]
                        ]
                    }
                }
            }
        },
        "ms238cpbtsql017": {
            "Type": "AWS::EC2::Instance",
            "Properties": {
                "AvailabilityZone": "us-east-1c",
                "DisableApiTermination": "true",
                "ImageId": {
                    "Ref": "BTAMI"
                },
                "InstanceType": "m3.xlarge",
                "KeyName": {
                    "Ref": "PemKey"
                },
                "SecurityGroupIds": [
                    {
                        "Ref": "CPDBSG"
                    },
                    {
                        "Ref": "NATCLIENT"
                    },"sg-42dc8b26"
                ],
                "SubnetId": {
                    "Ref": "Conf1c"
                },
                "Tags": [
                    {
                        "Key": "Name",
                        "Value": "ms238cpbtsql017"
                    },
                    {
                        "Key": "Application_Name",
                        "Value": "Cloud Pricing"
                    },
                    {
                        "Key": "Environment",
                        "Value": "Production"
                    },
                    {
                        "Key": "Security_Classification",
                        "Value": "Confidential"
                    },
                    {
                        "Key": "Cost_Center",
                        "Value" : { "Ref" : "CostCenter" }
                    },
                    {
                        "Key": "Owner",
                        "Value" : { "Ref" : "Owner" }
                    },
                    {
                        "Key": "System_Type",
                        "Value": " Database"
                    },
                    {
                        "Key": "Support_Criticality",
                        "Value": "Medium"
                    },
                    {
                        "Key": "Application_Id",
                        "Value": "APP-001151"
                    },
                    {
                        "Key": "Approver",
                        "Value" : { "Ref" : "Approver" }
                    }
                ],
                "UserData": {
                    "Fn::Base64": {
                        "Fn::Join": [
                            "",
                            [
                                "<powershell>\n",
                                "Rename-Computer -NewName ms238cpbtsql017 -Restart\n",
                                "</powershell>"
                            ]
                        ]
                    }
                }
            }
        },
        "ms238cpbtsql018": {
            "Type": "AWS::EC2::Instance",
            "Properties": {
                "AvailabilityZone": "us-east-1d",
                "DisableApiTermination": "true",
                "ImageId": {
                    "Ref": "BTAMI"
                },
                "InstanceType": "m3.xlarge",
                "KeyName": {
                    "Ref": "PemKey"
                },
                "SecurityGroupIds": [
                    {
                        "Ref": "CPDBSG"
                    },
                    {
                        "Ref": "NATCLIENT"
                    },"sg-42dc8b26"
                ],
                "SubnetId": {
                    "Ref": "Conf1d"
                },
                "Tags": [
                    {
                        "Key": "Name",
                        "Value": "ms238cpbtsql018"
                    },
                    {
                        "Key": "Application_Name",
                        "Value": "Cloud Pricing"
                    },
                    {
                        "Key": "Environment",
                        "Value": "Production"
                    },
                    {
                        "Key": "Security_Classification",
                        "Value": "Confidential"
                    },
                    {
                        "Key": "Cost_Center",
                        "Value" : { "Ref" : "CostCenter" }
                    },
                    {
                        "Key": "Owner",
                        "Value" : { "Ref" : "Owner" }
                    },
                    {
                        "Key": "System_Type",
                        "Value": " Database"
                    },
                    {
                        "Key": "Support_Criticality",
                        "Value": "Medium"
                    },
                    {
                        "Key": "Application_Id",
                        "Value": "APP-001151"
                    },
                    {
                        "Key": "Approver",
                        "Value" : { "Ref" : "Approver" }
                    }
                ],
                "UserData": {
                    "Fn::Base64": {
                        "Fn::Join": [
                            "",
                            [
                                "<powershell>\n",
                                "Rename-Computer -NewName ms238cpbtsql018 -Restart\n",
                                "</powershell>"
                            ]
                        ]
                    }
                }
            }
        },
        "ms238cpbtsql019": {
            "Type": "AWS::EC2::Instance",
            "Properties": {
                "AvailabilityZone": "us-east-1c",
                "DisableApiTermination": "true",
                "ImageId": {
                    "Ref": "BTAMI"
                },
                "InstanceType": "m3.xlarge",
                "KeyName": {
                    "Ref": "PemKey"
                },
                "SecurityGroupIds": [
                    {
                        "Ref": "CPDBSG"
                    },
                    {
                        "Ref": "NATCLIENT"
                    },"sg-42dc8b26"
                ],
                "SubnetId": {
                    "Ref": "Conf1c"
                },
                "Tags": [
                    {
                        "Key": "Name",
                        "Value": "ms238cpbtsql019"
                    },
                    {
                        "Key": "Application_Name",
                        "Value": "Cloud Pricing"
                    },
                    {
                        "Key": "Environment",
                        "Value": "Production"
                    },
                    {
                        "Key": "Security_Classification",
                        "Value": "Confidential"
                    },
                    {
                        "Key": "Cost_Center",
                        "Value" : { "Ref" : "CostCenter" }
                    },
                    {
                        "Key": "Owner",
                        "Value" : { "Ref" : "Owner" }
                    },
                    {
                        "Key": "System_Type",
                        "Value": " Database"
                    },
                    {
                        "Key": "Support_Criticality",
                        "Value": "Medium"
                    },
                    {
                        "Key": "Application_Id",
                        "Value": "APP-001151"
                    },
                    {
                        "Key": "Approver",
                        "Value" : { "Ref" : "Approver" }
                    }
                ],
                "UserData": {
                    "Fn::Base64": {
                        "Fn::Join": [
                            "",
                            [
                                "<powershell>\n",
                                "Rename-Computer -NewName ms238cpbtsql019 -Restart\n",
                                "</powershell>"
                            ]
                        ]
                    }
                }
            }
        },
        "ms238cpbtsql020": {
            "Type": "AWS::EC2::Instance",
            "Properties": {
                "AvailabilityZone": "us-east-1d",
                "DisableApiTermination": "true",
                "ImageId": {
                    "Ref": "BTAMI"
                },
                "InstanceType": "m3.xlarge",
                "KeyName": {
                    "Ref": "PemKey"
                },
                "SecurityGroupIds": [
                    {
                        "Ref": "CPDBSG"
                    },
                    {
                        "Ref": "NATCLIENT"
                    },"sg-42dc8b26"
                ],
                "SubnetId": {
                    "Ref": "Conf1d"
                },
                "Tags": [
                    {
                        "Key": "Name",
                        "Value": "ms238cpbtsql020"
                    },
                    {
                        "Key": "Application_Name",
                        "Value": "Cloud Pricing"
                    },
                    {
                        "Key": "Environment",
                        "Value": "Production"
                    },
                    {
                        "Key": "Security_Classification",
                        "Value": "Confidential"
                    },
                    {
                        "Key": "Cost_Center",
                        "Value" : { "Ref" : "CostCenter" }
                    },
                    {
                        "Key": "Owner",
                        "Value" : { "Ref" : "Owner" }
                    },
                    {
                        "Key": "System_Type",
                        "Value": " Database"
                    },
                    {
                        "Key": "Support_Criticality",
                        "Value": "Medium"
                    },
                    {
                        "Key": "Application_Id",
                        "Value": "APP-001151"
                    },
                    {
                        "Key": "Approver",
                        "Value" : { "Ref" : "Approver" }
                    }
                ],
                "UserData": {
                    "Fn::Base64": {
                        "Fn::Join": [
                            "",
                            [
                                "<powershell>\n",
                                "Rename-Computer -NewName ms238cpbtsql020 -Restart\n",
                                "</powershell>"
                            ]
                        ]
                    }
                }
            }
        },
        "ms238cpbtsql021": {
            "Type": "AWS::EC2::Instance",
            "Properties": {
                "AvailabilityZone": "us-east-1c",
                "DisableApiTermination": "true",
                "ImageId": {
                    "Ref": "BTAMI"
                },
                "InstanceType": "m3.xlarge",
                "KeyName": {
                    "Ref": "PemKey"
                },
                "SecurityGroupIds": [
                    {
                        "Ref": "CPDBSG"
                    },
                    {
                        "Ref": "NATCLIENT"
                    },"sg-42dc8b26"
                ],
                "SubnetId": {
                    "Ref": "Conf1c"
                },
                "Tags": [
                    {
                        "Key": "Name",
                        "Value": "ms238cpbtsql021"
                    },
                    {
                        "Key": "Application_Name",
                        "Value": "Cloud Pricing"
                    },
                    {
                        "Key": "Environment",
                        "Value": "Production"
                    },
                    {
                        "Key": "Security_Classification",
                        "Value": "Confidential"
                    },
                    {
                        "Key": "Cost_Center",
                        "Value" : { "Ref" : "CostCenter" }
                    },
                    {
                        "Key": "Owner",
                        "Value" : { "Ref" : "Owner" }
                    },
                    {
                        "Key": "System_Type",
                        "Value": " Database"
                    },
                    {
                        "Key": "Support_Criticality",
                        "Value": "Medium"
                    },
                    {
                        "Key": "Application_Id",
                        "Value": "APP-001151"
                    },
                    {
                        "Key": "Approver",
                        "Value" : { "Ref" : "Approver" }
                    }
                ],
                "UserData": {
                    "Fn::Base64": {
                        "Fn::Join": [
                            "",
                            [
                                "<powershell>\n",
                                "Rename-Computer -NewName ms238cpbtsql021 -Restart\n",
                                "</powershell>"
                            ]
                        ]
                    }
                }
            }
        },
        "ms238cpbtsql022": {
            "Type": "AWS::EC2::Instance",
            "Properties": {
                "AvailabilityZone": "us-east-1d",
                "DisableApiTermination": "true",
                "ImageId": {
                    "Ref": "BTAMI"
                },
                "InstanceType": "m3.xlarge",
                "KeyName": {
                    "Ref": "PemKey"
                },
                "SecurityGroupIds": [
                    {
                        "Ref": "CPDBSG"
                    },
                    {
                        "Ref": "NATCLIENT"
                    },"sg-42dc8b26"
                ],
                "SubnetId": {
                    "Ref": "Conf1d"
                },
                "Tags": [
                    {
                        "Key": "Name",
                        "Value": "ms238cpbtsql022"
                    },
                    {
                        "Key": "Application_Name",
                        "Value": "Cloud Pricing"
                    },
                    {
                        "Key": "Environment",
                        "Value": "Production"
                    },
                    {
                        "Key": "Security_Classification",
                        "Value": "Confidential"
                    },
                    {
                        "Key": "Cost_Center",
                        "Value" : { "Ref" : "CostCenter" }
                    },
                    {
                        "Key": "Owner",
                        "Value" : { "Ref" : "Owner" }
                    },
                    {
                        "Key": "System_Type",
                        "Value": " Database"
                    },
                    {
                        "Key": "Support_Criticality",
                        "Value": "Medium"
                    },
                    {
                        "Key": "Application_Id",
                        "Value": "APP-001151"
                    },
                    {
                        "Key": "Approver",
                        "Value" : { "Ref" : "Approver" }
                    }
                ],
                "UserData": {
                    "Fn::Base64": {
                        "Fn::Join": [
                            "",
                            [
                                "<powershell>\n",
                                "Rename-Computer -NewName ms238cpbtsql022 -Restart\n",
                                "</powershell>"
                            ]
                        ]
                    }
                }
            }
        },
        "WebServerGroup": {
            "Type": "AWS::AutoScaling::AutoScalingGroup",
            "Properties": {
                "AvailabilityZones": [
                    "us-east-1c",
                    "us-east-1d"
                ],
                "LaunchConfigurationName": {
                    "Ref": "WebLaunchConfig"
                },
                "MinSize": "2",
                "MaxSize": "6",
                "DesiredCapacity": "2",
				"HealthCheckGracePeriod": "900",
                "HealthCheckType": "ELB",
                "VPCZoneIdentifier": [
                    {
                        "Ref": "Conf1c"
                    },
                    {
                        "Ref": "Conf1d"
                    }
                ],
                "LoadBalancerNames": [
                    {
                        "Ref": "CPELB"
                    }
                ],
                "Tags": [
                    {
                        "Key": "Name",
                        "Value": "CP Web Autoscale Instance",
                        "PropagateAtLaunch": "true"
                    },
                    {
                        "Key": "Application_Name",
                        "Value": "Cloud Pricing",
                        "PropagateAtLaunch": "true"
                    },
                    {
                        "Key": "Environment",
                        "Value": "Production",
                        "PropagateAtLaunch": "true"
                    },
                    {
                        "Key": "Security_Classification",
                        "Value": "Confidential",
                        "PropagateAtLaunch": "true"
                    },
                    {
                        "Key": "Cost_Center",
                        "Value" : { "Ref" : "CostCenter" },
                        "PropagateAtLaunch": "true"
                    },
                    {
                        "Key": "Support_Criticality",
                        "Value": "Medium",
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
                        "Value" : { "Ref" : "Owner" },
                        "PropagateAtLaunch": "true"
                    },
                    {
                        "Key": "Approver",
                        "Value" : { "Ref" : "Approver" },
                        "PropagateAtLaunch": "true"
                    }
                ]
            }
        },
        "WebLaunchConfig": {
            "Type": "AWS::AutoScaling::LaunchConfiguration",
            "Metadata": {
                "AWS::CloudFormation::Init": {
                    "configSets": {
                        "default": [
                            "pullScript"
                        ]
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
                                            {
                                                "Ref": "AWS::StackName"
                                            },
                                            "\n",
                                            "region=",
                                            {
                                                "Ref": "AWS::Region"
                                            },
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
                                            {
                                                "Ref": "AWS::StackName"
                                            },
                                            " -r WebLaunchConfig",
                                            " --region ",
                                            {
                                                "Ref": "AWS::Region"
                                            },
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
                                "command": "PowerShell.exe -ExecutionPolicy Bypass -File D:\\AutomateDeployment.ps1 WS PROD 5",
                                "waitAfterCompletion": "300"
                            }
                        }
                    }
                }
            },
            "Properties": {
                "KeyName": {
                    "Ref": "PemKey"
                },
                "ImageId": {
                    "Ref": "CPAS02"
                },
                "SecurityGroups": [
                    {
                        "Ref": "CPWEBSG"
                    },
                                        {
                        "Ref": "NATCLIENT"
                    }
                ],
                "InstanceType": "m3.large",
                "UserData": {
                    "Fn::Base64": {
                        "Fn::Join": [
                            "",
                            [
                                "<script>\n",
                                "cfn-init.exe -v -s ",
                                {
                                    "Ref": "AWS::StackName"
                                },
                                " -r WebLaunchConfig",
                                " --region ",
                                {
                                    "Ref": "AWS::Region"
                                },
                                "\n",
                                "</script>"
                            ]
                        ]
                    }
                }
            }
        },
        "WebServerScaleUpPolicy": {
            "Type": "AWS::AutoScaling::ScalingPolicy",
            "Properties": {
                "AdjustmentType": "ChangeInCapacity",
                "AutoScalingGroupName": {
                    "Ref": "WebServerGroup"
                },
                "Cooldown": "60",
                "ScalingAdjustment": "1"
            }
        },
        "WebServerScaleDownPolicy": {
            "Type": "AWS::AutoScaling::ScalingPolicy",
            "Properties": {
                "AdjustmentType": "ChangeInCapacity",
                "AutoScalingGroupName": {
                    "Ref": "WebServerGroup"
                },
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
                "AlarmActions": [
                    {
                        "Ref": "WebServerScaleUpPolicy"
                    }
                ],
                "Dimensions": [
                    {
                        "Name": "AutoScalingGroupName",
                        "Value": {
                            "Ref": "WebServerGroup"
                        }
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
                "AlarmActions": [
                    {
                        "Ref": "WebServerScaleDownPolicy"
                    }
                ],
                "Dimensions": [
                    {
                        "Name": "AutoScalingGroupName",
                        "Value": {
                            "Ref": "WebServerGroup"
                        }
                    }
                ],
                "ComparisonOperator": "LessThanThreshold"
            }
        },
        "CPELB": {
            "Type": "AWS::ElasticLoadBalancing::LoadBalancer",
            "Properties": {
                "Subnets": [
                    {
                        "Ref": "Conf1c"
                    },
                    {
                        "Ref": "Conf1d"
                    }
                ],
                "LoadBalancerName": "ws02-cp-prod-sysco",
                "Scheme": "internal",
                "SecurityGroups": [
                    {
                        "Ref": "CPWEBSG"
                    }
                ],
                "CrossZone": "true",
                 "AccessLoggingPolicy": {
                    "EmitInterval": "60",
                    "Enabled": "True",
                    "S3BucketName": "sysco-prod-log",
                    "S3BucketPrefix": "ELB"
                },
                "ConnectionDrainingPolicy": {
                    "Enabled": "true",
                    "Timeout": "60"
                },
                "Listeners": [
                    {
                        "LoadBalancerPort": "80",
                        "InstancePort": "80",
                        "Protocol": "HTTP"
                    },
                    {
                        "LoadBalancerPort": "443",
                        "InstancePort": "80",
                        "Protocol": "HTTPS",
                        "SSLCertificateId": "arn:aws:iam::467936237394:server-certificate/Cloud-Pricing"
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
                        "Value": "ws02-cp-prod-sysco"
                    },
                    {
                        "Key": "Application_Name",
                        "Value": "Cloud Pricing"
                    },
                    {
                        "Key": "Environment",
                        "Value": "Production"
                    },
                    {
                        "Key": "Security_Classification",
                        "Value": "Confidential"
                    },
                    {
                        "Key": "Cost_Center",
                        "Value" : { "Ref" : "CostCenter" }
                    },
                    {
                        "Key": "Owner",
                        "Value" : { "Ref" : "Owner" }
                    },
                    {
                        "Key": "System_Type",
                        "Value": "Load Balancer"
                    },
                    {
                        "Key": "Support_Criticality",
                        "Value": "High"
                    },
                    {
                        "Key": "Application_Id",
                        "Value": "APP-001151"
                    },
                    {
                        "Key": "Approver",
                        "Value" : { "Ref" : "Approver" }
                    }
                ]
            }
        }
    }
}