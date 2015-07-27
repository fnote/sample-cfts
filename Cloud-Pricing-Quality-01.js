{ 
    "AWSTemplateFormatVersion" : "2010-09-09",

    "Description" : "Deployed via Cloud-Pricing-Quality-01.js - Web, OD, Batch servers included.",

    "Parameters" : {

        "PvtSNc" : {
            "Description" : "Private subnet for confidential apps in us-east-1c",
            "Type" : "String",
      	    "Default" : "subnet-b61cbb9d"
        },
        "QualityDBSG" : {
            "Description" : "Cloud Pricing Quality DB Servers Security Group",
            "Type" : "String",
      	    "Default" : "sg-ec615089"
        },
        "qaWEBSG" : {
            "Description" : "Cloud Pricing Quality Web Servers Security Group",
            "Type" : "String",
      	    "Default" : "sg-14d48271"
        },
        "qaWEBAMI" : {
            "Description" : "Cloud Pricing Quality Web Servers Security Group",
            "Type" : "String",
      	    "Default" : "ami-2e724846"
        },
        "VPCID" : {
            "Description" : "Name of and existing VPC",
            "Type" : "String",
	        "Default" : "vpc-ff88269a"
        },
		"PemKey" : {
            "Description" : "Name of and existing EC2 KeyPair to enable SSH access to the instance",
            "Type" : "String",
	        "Default" : "Sysco-KP-CP-NonProd"
        },
		"ODAMI" : {
            "Description" : "AMI for OD servers",
            "Type" : "String",
	        "Default" : "ami-a43d31cc"
        },
		"Private2c" : {
            "Description" : "Non-Production Confidential us-east-1c subnet",
            "Type" : "String",
	        "Default" : "subnet-b61cbb9d"
        },
		"Private2d" : {
            "Description" : "Non-Production Confidential us-east-1d subnet",
            "Type" : "String",
	        "Default" : "subnet-ea138a9d"
        }
    },

    "Resources" : {
	    "WebLaunchConfig" : {
    	    "Type" : "AWS::AutoScaling::LaunchConfiguration",
            "Metadata" : {
        		"AWS::CloudFormation::Init" : {
        			"configSets" : {
        				"default" : [ "pullScript" ]
					},
					"pullScript" : {
						"files" : {
                            "c:\\cfn\\cfn-hup.conf" : {
                                "content" : { "Fn::Join" : ["", [
                                    "[main]\n",
                                    "stack=", 
									{ "Ref" : "AWS::StackName" }, 
									"\n",
                                    "region=", { "Ref" : "AWS::Region" }, "\n"
                                ]]}
                            },
                            "c:\\cfn\\hooks.d\\cfn-auto-reloader.conf" : {
                                "content": { "Fn::Join" : ["", [
                                    "[cfn-auto-reloader-hook]\n",
                                    "triggers=post.update\n",
                                    "path=Resources.WebLaunchConfig.Metadata.AWS::CloudFormation::Init\n",
                                    "action=cfn-init.exe -v -s ", 
	                                { "Ref" : "AWS::StackName" },
                                    " -r WebLaunchConfig",
                                    " --region ", { "Ref" : "AWS::Region" }, 
									"\n"
                                ]]}
                            },
							"d:\\AutomateDeployment.ps1" : {
							    "source" : "http://ms240hudson02.na.sysco.net/jenkins-1.5.0/view/Cloud%20Pricing%20Promotion/job/CloudPricing_1.0/lastSuccessfulBuild/artifact/AMI/Deployment/AutomateDeployment.ps1"
							}
                        },
					    "commands" : {
					        "b-execute-script" : {
						        "command" : "PowerShell.exe -ExecutionPolicy Bypass -File D:\\AutomateDeployment.ps1 WS QA 5", 
						    	"waitAfterCompletion" : "300"
						    }
						}
					}
				}
			},
        	"Properties" : {
            	"KeyName" : { "Ref" : "PemKey" },
	            "ImageId" :  "ami-2e724846",
    	        "SecurityGroups" : [ { "Ref" : "QualityWEBSG" } ],
        	    "InstanceType" : "m3.medium",
                "UserData" : { "Fn::Base64" : { "Fn::Join" : ["", [
    					"<script>\n",
    					"cfn-init.exe -v -s ", { "Ref" : "AWS::StackName" },
    					" -r WebLaunchConfig",
    					" --region ", { "Ref" : "AWS::Region" }, "\n",
    					"</script>"
    				]]}
  				}				
        	}	
    	},
		"WebServerGroup" : {
			"Type" : "AWS::AutoScaling::AutoScalingGroup",
			"Properties" : {
				"AvailabilityZones" : ["us-east-1c"],
				"LaunchConfigurationName" : { "Ref" : "WebLaunchConfig" },
				"MinSize" : "1",
				"MaxSize" : "1",
				"DesiredCapacity" : "1",
				"VPCZoneIdentifier" : [ { "Ref" : "Private2c" }],
				"Tags" : [ 
					{ "Key" : "Name", "Value": "MS238CPWS01q", "PropagateAtLaunch" : "true" },
					{ "Key" : "Application_Name", "Value": "Cloud Pricing", "PropagateAtLaunch" : "true" },
					{ "Key" : "Environment", "Value": "Quality", "PropagateAtLaunch" : "true" },
					{ "Key" : "Security_Classification", "Value" : "Confidential", "PropagateAtLaunch" : "true" },
					{ "Key" : "Cost_Center", "Value" : "USFBTECH PO 28843", "PropagateAtLaunch" : "true" },
					{ "Key" : "Support_Criticality", "Value" : "High", "PropagateAtLaunch" : "true" },
					{ "Key" : "Application_Id", "Value" : "APP-001151", "PropagateAtLaunch" : "true" },
					{ "Key" : "System_Type", "Value": "Application Server", "PropagateAtLaunch" : "true" },
					{ "Key" : "Owner", "Value" : "Mike Tran", "PropagateAtLaunch" : "true" },
					{ "Key" : "Approver", "Value" : "Mike Tran", "PropagateAtLaunch" : "true" }		  
				]
			}
		},
	    "WebServerScaleUpPolicy" : {
    	    "Type" : "AWS::AutoScaling::ScalingPolicy",
        	"Properties" : {
            	"AdjustmentType" : "ChangeInCapacity",
	            "AutoScalingGroupName" : { "Ref" : "WebServerGroup" },
    	        "Cooldown" : "60",
        	    "ScalingAdjustment" : "1"
        	}	
    	},
	    "WebServerScaleDownPolicy" : {
    	    "Type" : "AWS::AutoScaling::ScalingPolicy",
        	"Properties" : {
            	"AdjustmentType" : "ChangeInCapacity",
 	            "AutoScalingGroupName" : { "Ref" : "WebServerGroup" },
	            "Cooldown" : "60",
    	        "ScalingAdjustment" : "-1"
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
    	        }],
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
    	        }],
        	"ComparisonOperator": "LessThanThreshold"
        	}
    	},
	    "QualityWEBSG" : {
    	    "Type" : "AWS::EC2::SecurityGroup",
	        "Properties" : {
	            "GroupDescription" : "Quality web services security group",
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
					"FromPort" : "443", 
					"ToPort" : "443", 
					"CidrIp" : "10.0.0.0/8" 
				},
				{
       	            "IpProtocol": "tcp",
       	            "FromPort": "3389",
       	            "ToPort": "3389",
       	            "CidrIp": "10.0.0.0/8"
                }],
		        "Tags" : [ { "Key" : "Name", "Value" : "sg/vpc_sysco_nonprod_02/cp_web_qa" } ]
        	}   
    	},
		"IngressAdder3":{
			"DependsOn": "QualityWEBSG",
			"Type": "AWS::EC2::SecurityGroupIngress",
			"Properties":
			{
				"FromPort" : "-1",
				"GroupId" : {"Ref":"QualityWEBSG"},
				"IpProtocol" : "-1",
				"SourceSecurityGroupId" : {"Ref":"QualityWEBSG"},
				"ToPort" : "-1"
	    	}
		},
		"MS238CPODSQL02q": {
		    "Type" : "AWS::EC2::Instance",
	    	"Properties" : {
		    	"AvailabilityZone" : "us-east-1c",
			    "DisableApiTermination" : "true",
			    "ImageId" : {"Ref" : "ODAMI"},
			    "InstanceType" : "m3.large",
		    	"KeyName" : {"Ref" : "PemKey"},
			    "SecurityGroupIds" : [{ "Ref" : "QualityDBSG" }],
			    "SubnetId" : { "Ref" : "Private2c" },
		    	"Tags" : [ 
		        	{ "Key" : "Name", "Value": "MS238CPODSQL02q" },
			        { "Key" : "Application_Name", "Value": "Cloud Pricing" },
			        { "Key" : "Environment", "Value": "Quality" },
			        { "Key" : "Security_Classification", "Value" : "Confidential" },
		    	    { "Key" : "Cost_Center", "Value" : "USFBTECH PO 28843" },
		        	{ "Key" : "System_Type", "Value": "Database" },
			        { "Key" : "Support_Criticality", "Value" : "Low" },
			        { "Key" : "Application_Id", "Value" : "APP-001151" },
			        { "Key" : "Owner", "Value" : "Mike Tran" },
		    	    { "Key" : "Approver", "Value" : "Mike Tran" }
		    	],
				"UserData"         : {
                    "Fn::Base64" : {
                        "Fn::Join" : [
                            "",
                            [
                                "<powershell>\n",
                                "Rename-Computer -NewName ms238cpodsql02 -Restart\n",
                                "</powershell>"
                            ]
                        ]
                    }
                }
			}
		},
		"MS238CPBTSQL02q": {
		    "Type" : "AWS::EC2::Instance",
	    	"Properties" : {
		    	"AvailabilityZone" : "us-east-1c",
			    "DisableApiTermination" : "true",
			    "ImageId" : "ami-eed68d86",
			    "InstanceType" : "m3.large",
		    	"KeyName" : {"Ref" : "PemKey"},
			    "SecurityGroupIds" : [{ "Ref" : "QualityDBSG" }],
			    "SubnetId" : { "Ref" : "Private2c" },
		    	"Tags" : [ 
		        	{ "Key" : "Name", "Value": "MS238CPBTSQL02q" },
			        { "Key" : "Application_Name", "Value": "Cloud Pricing" },
			        { "Key" : "Environment", "Value": "Quality" },
			        { "Key" : "Security_Classification", "Value" : "Confidential" },
		    	    { "Key" : "Cost_Center", "Value" : "USFBTECH PO 28843" },
		        	{ "Key" : "System_Type", "Value": "Database" },
			        { "Key" : "Support_Criticality", "Value" : "Low" },
			        { "Key" : "Application_Id", "Value" : "APP-001151" },
			        { "Key" : "Owner", "Value" : "Mike Tran" },
		    	    { "Key" : "Approver", "Value" : "Mike Tran" }
		    	],
				"UserData"         : {
                    "Fn::Base64" : {
                        "Fn::Join" : [
                            "",
                            [
                                "<powershell>\n",
                                "Rename-Computer -NewName ms238cpbtsql02 -Restart\n",
                                "</powershell>"
                            ]
                        ]
                    }
                }
			}
		}
	}
}
