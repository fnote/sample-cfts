{
    "AWSTemplateFormatVersion" : "2010-09-09", 

    "Description" : "Deployed via Cloud-Pricing-Dev-01_v1",

    "Parameters" : {

        "PvtSNc" : {
            "Description" : "Private subnet for confidential apps in us-east-1c",
            "Type" : "String",
      	    "Default" : "subnet-b61cbb9d"
        },
        "VPCID" : {
            "Description" : "Name of and existing VPC",
            "Type" : "String",
	        "Default" : "vpc-ff88269a"
        },
        "DevDBSG" : {
            "Description" : "Name of and existing VPC",
            "Type" : "String",
	        "Default" : "sg-fb6c6b9e"
        },
        "CommonAMI" : {
            "Description" : "Name of and existing VPC",
            "Type" : "String",
	        "Default" : "ami-eed68d86"
        },
		"PemKey" : {
            "Description" : "Name of and existing EC2 KeyPair to enable SSH access to the instance",
            "Type" : "String",
	        "Default" : "Sysco-KP-CP-NonProd"
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
						        "command" : "PowerShell.exe -ExecutionPolicy Bypass -File D:\\AutomateDeployment.ps1 WS DEV 5",
						    	"waitAfterCompletion" : "300"
						    }
						}
					}
				}
			},
        	"Properties" : {
            	"KeyName" : { "Ref" : "PemKey" },
	            "ImageId" : "ami-9ae1cdf2",
    	        "SecurityGroups" : [ { "Ref" : "DevWEBSG" } ],
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
		"MS238CPWS04d": {
			"Type" : "AWS::EC2::Instance",
			"Properties" : {
				"AvailabilityZone" : "us-east-1c",
				"DisableApiTermination" : "true",
				"ImageId" : "ami-9ae1cdf2",
				"InstanceType" : "m3.medium",
				"KeyName" : {"Ref" : "PemKey"},
				"SecurityGroupIds" : [{ "Ref" : "DevWEBSG" }],
				"SubnetId" : { "Ref" : "PvtSNc" },
				"UserData" : { "Fn::Base64" : { "Fn::Join" : ["", [
    					"<script>\n",
    					"cfn-init.exe -v -s ", { "Ref" : "AWS::StackName" },
    					" -r WebLaunchConfig",
    					" --region ", { "Ref" : "AWS::Region" }, "\n",
    					"</script>"
    				]]}
  				},
				"Tags" : [ 
				    { "Key" : "Name", "Value": "MS238CPWS04d" },
				    { "Key" : "Application_Name", "Value": "Cloud Pricing" },
				    { "Key" : "Environment", "Value": "Development" },
				    { "Key" : "Security_Classification", "Value" : "Confidential" },
				    { "Key" : "Cost_Center", "Value" : "USFBTECH PO 28843" },
				    { "Key" : "System_Type", "Value": "Application Server" },
				    { "Key" : "Support_Criticality", "Value" : "Low" },
		     	    { "Key" : "Application_Id", "Value" : "APP-001151" },
			        { "Key" : "Owner", "Value" : "Sheraz Khan" },
			        { "Key" : "Approver", "Value" : "Sheraz Khan" }
				]
			}
		},
		"MS238CPWS03d": {
			"Type" : "AWS::EC2::Instance",
			"Properties" : {
				"AvailabilityZone" : "us-east-1c",
				"DisableApiTermination" : "true",
				"ImageId" : "ami-9ae1cdf2",
				"InstanceType" : "m3.medium",
				"KeyName" : {"Ref" : "PemKey"},
				"SecurityGroupIds" : [{ "Ref" : "DevWEBSG" }],
				"SubnetId" : { "Ref" : "PvtSNc" },
				"UserData" : { "Fn::Base64" : { "Fn::Join" : ["", [
    					"<script>\n",
    					"cfn-init.exe -v -s ", { "Ref" : "AWS::StackName" },
    					" -r WebLaunchConfig",
    					" --region ", { "Ref" : "AWS::Region" }, "\n",
    					"</script>"
    				]]}
  				},
				"Tags" : [ 
				    { "Key" : "Name", "Value": "MS238CPWS03d" },
				    { "Key" : "Application_Name", "Value": "Cloud Pricing" },
				    { "Key" : "Environment", "Value": "Development" },
				    { "Key" : "Security_Classification", "Value" : "Confidential" },
				    { "Key" : "Cost_Center", "Value" : "USFBTECH PO 28843" },
				    { "Key" : "System_Type", "Value": "Application Server" },
				    { "Key" : "Support_Criticality", "Value" : "Low" },
			        { "Key" : "Application_Id", "Value" : "APP-001151" },
			        { "Key" : "Owner", "Value" : "Sheraz Khan" },
			        { "Key" : "Approver", "Value" : "Sheraz Khan" }
				]
			}
		},
		"DevWEBSG" : {
			"Type" : "AWS::EC2::SecurityGroup",
			"Properties" : {
				"GroupDescription" : "Dev web services security group",
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
				"Tags" : [ { "Key" : "Name", "Value" : "sg/vpc_sysco_nonprod_02/cp_web_dev" } ]
			}   
		},
		"IngressAdder1":{
			"DependsOn": "DevWEBSG",
			"Type": "AWS::EC2::SecurityGroupIngress",
			"Properties":
			{
				"FromPort" : "-1",
				"GroupId" : {"Ref":"DevWEBSG"},
				"IpProtocol" : "-1",
				"SourceSecurityGroupId" : {"Ref":"DevWEBSG"},
				"ToPort" : "-1"
			}
		},
	    "CPDEVELB" : {
			"Type" : "AWS::ElasticLoadBalancing::LoadBalancer",
			"Properties" : {
				"Subnets" : [{"Ref" : "PvtSNc"}],
				"LoadBalancerName" : "elb-ws01-cp-dev",
				"Scheme" : "internal",
				"CrossZone": "true",
				"Instances" : [ {"Ref" : "MS238CPWS04d"},{"Ref" : "MS238CPWS03d"} ],
				"SecurityGroups" : [ {"Ref" : "DevWEBSG"}],
				"Listeners" : [ 
				{
				    "LoadBalancerPort" : "80",
				    "InstancePort" :  "80" ,
				    "Protocol" : "HTTP"
				},
				{ 
				    "LoadBalancerPort" : "443",
				    "InstancePort" : "443" ,
				    "Protocol" : "TCP"
			    }],
				"HealthCheck" : 
				{
				    "Target" : "HTTP:80/pricerequest/healthcheck",
				    "HealthyThreshold" : "10",
				    "UnhealthyThreshold" : "2",
				    "Interval" : "30",
				    "Timeout" : "5"
				},
				"Tags" : [ 
			        { "Key" : "Name", "Value": "elb_ws01/vpc_sysco_nonprod_02/cp_dev" },
			        { "Key" : "Application_Name", "Value": "Cloud Pricing" },
			        { "Key" : "Environment", "Value": "Quality" },
			        { "Key" : "Security_Classification", "Value" : "Confidential" },
			        { "Key" : "Cost_Center", "Value" : "USFBTECH PO 28843" },
			        { "Key" : "Owner", "Value" : "Sheraz Khan" }
			    ]
			}
		},
		"MS238CPSQL04d": {
			"Type" : "AWS::EC2::Instance",
			"Properties" : {
				"AvailabilityZone" : "us-east-1c",
				"DisableApiTermination" : "true",
				"ImageId" : { "Ref" : "CommonAMI" },
				"InstanceType" : "m3.large",
				"KeyName" : {"Ref" : "PemKey"},
				"SecurityGroupIds" : [{ "Ref" : "DevDBSG" }],
				"SubnetId" : { "Ref" : "PvtSNc" },
				"Tags" : [ 
				    { "Key" : "Name", "Value": "MS238CPSQL04d" },
				    { "Key" : "Application_Name", "Value": "Cloud Pricing" },
				    { "Key" : "Environment", "Value": "Development" },
				    { "Key" : "Security_Classification", "Value" : "Confidential" },
				    { "Key" : "Cost_Center", "Value" : "USFBTECH PO 28843" },
				    { "Key" : "System_Type", "Value": " Database" },
				    { "Key" : "Support_Criticality", "Value" : "Low" },
			        { "Key" : "Application_Id", "Value" : "APP-001151" },
			        { "Key" : "Owner", "Value" : "Sheraz Khan" },
			        { "Key" : "Approver", "Value" : "Sheraz Khan" }
				]
			}
		}
		
	}
}