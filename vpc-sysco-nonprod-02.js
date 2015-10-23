{ 
    "AWSTemplateFormatVersion" : "2010-09-09",  

    "Description" : "Non Prod VPC includes Tuning,Quality and Dev resources with 2 subnets across 2 Availability Zones. Removed Dev, QA and Tuning web servers. -CFT:vpc-sysco-nonprod-02.js",

    "Parameters" : {
        "CorporateCidrIp" : {
            "Description" : "Sysco CidrIp (to restrict traffic to be authorized ONLY from corporate office)",
            "Type" : "String",
            "Default" :  "10.0.0.0/8"
        },
	    "VpcCidr" : {
            "Description" : "VPC CIDR block (required for creating NAT security group rules for NATing traffic).",
            "Type" : "String",
            "Default" : "10.168.128.0/20"
        },
	    "NATNodeInstanceType" : {
            "Description" : "Instance type for NAT nodes.",
            "Type" : "String",
            "Default" : "m1.small",
            "AllowedValues" : [ "t1.micro","t2.small","m1.small","m1.medium","m1.large","m1.xlarge","m2.xlarge","m2.2xlarge","m2.4xlarge","c1.medium","c1.xlarge","cc1.4xlarge","cc2.8xlarge","cg1.4xlarge","t2.small"],
            "ConstraintDescription" : "must be a valid EC2 instance type."
        },
	    "NumberOfPings" : {
            "Description" : "The number of times the health check will ping the alternate NAT Node",
            "Type" : "String",
            "Default" : "3"
        },
        "NewPubSub1" : {
            "Description" : "existing public subnet 1",
            "Type" : "String",
            "Default" : "subnet-24fed553"
        },
        "NatAccessParam" : {
            "Description" : "Nat access SG ID",
            "Type" : "String",
            "Default" : "sg-e151a186"
        },
        "Nat01" : {
            "Description" : "lx238nonprodnat01 InstanceId",
            "Type" : "String",
            "Default" : "i-b215301a"
        },
	    "PingTimeout" : {
            "Description" : "The number of seconds to wait for each ping response before determining that the ping has failed",
            "Type" : "String",
            "Default" : "1"
        },
	    "WaitBetweenPings" : {
            "Description" : "The number of seconds to wait between health checks",
            "Type" : "String",
            "Default" : "2"
        },
	    "WaitForInstanceStop" : {
            "Description" : "The number of seconds to wait for alternate NAT Node to stop before attempting to stop it again",
            "Type" : "String",
            "Default" : "60"
        },
	    "WaitForInstanceStart" : {
            "Description" : "The number of seconds to wait for alternate NAT Node to restart before resuming health checks again",
            "Type" : "String",
            "Default" : "300"
	    },
        "PemKey" : {
            "Description" : "Name of and existing EC2 KeyPair to enable SSH access to the instance",
            "Type" : "String",
	        "Default" : "Sysco-CP-TUNING"
        },
        "QAPemKey" : {
            "Description" : "Name of and existing EC2 KeyPair to enable SSH access to the instance",
            "Type" : "String",
	        "Default" : "Sysco-CP-QUALITY"
        },
        "QualityWEBSG" : {
            "Description" : "New WebSG in new CFT",
            "Type" : "String",
	        "Default" : "sg-7874381c"
        },
        "CheckMKClient" : {
            "Description" : "allow check mk access",
            "Type" : "String",
	        "Default" : "sg-0f7fc468"
        },
        "DevPemKey" : {
            "Description" : "Name of and existing EC2 KeyPair to enable SSH access to the instance",
            "Type" : "String",
	        "Default" : "Sysco-DEV"
        }
    },
    "Mappings" : {
        "AWSNATAMI" : {
            "us-east-1"      : { "AMI" : "ami-54cf5c3d" },
            "us-west-2"      : { "AMI" : "ami-8e27adbe" },
            "us-west-1"      : { "AMI" : "ami-b63210f3" },
            "eu-west-1"      : { "AMI" : "ami-3c5f5748" },
            "ap-southeast-1" : { "AMI" : "ami-ba7538e8" },
            "ap-southeast-2" : { "AMI" : "ami-b6df4e8c" },
            "ap-northeast-1" : { "AMI" : "ami-5d7dfa5c" },
            "sa-east-1"      : { "AMI" : "ami-89c81394" }
        }
    },
  
       "Resources" : {
        "vpcsyscononprod02" : {
	        "Type" : "AWS::EC2::VPC",
    	    "Properties" : {
        	   "CidrBlock" : "10.168.128.0/20",
		    	"EnableDnsHostnames" : "true",
	    		"Tags" : [ 
		    		{"Key" : "Name", "Value" : "vpc_sysco_nonprod_02"},
			    	{"Key" : "Application_Name", "Value": "AWS Foundation" },
				    { "Key" : "Environment", "Value": "Development" },
    				{ "Key" : "Security_Classification", "Value" : "Confidential" },
    				{ "Key" : "Cost_Center", "Value" : "USFBTECH PO 28843" },
    				{ "Key" : "Application_Id", "Value" : "APP-001151" },
    	            { "Key" : "Owner", "Value" : "Sheraz Khan" },
		    	    { "Key" : "Approver", "Value" : "Sheraz Khan" },
	    			{ "Key" : "System_Type", "Value": "Networking" },
	    			{ "Key" : "Support_Criticality", "Value" : "Low" }
				]
			}
        },
		"SyscoCustGateway" : {
		    "Type" : "AWS::EC2::CustomerGateway",
	    	"Properties" : {
		    	"BgpAsn" : "65000",
			    "IpAddress" : "66.60.245.5",
			    "Type" : "ipsec.1"
	    	}
		},
	    "SyscoIGW" : {
	        "Type" : "AWS::EC2::InternetGateway",
		    "Properties" : {
		        "Tags" : [ { "Key" : "Name", "Value" : "igw/vpc_sysco_nonprod_02" } ]
	        }
	    },
	    "AttachIGW" : {
	        "Type" : "AWS::EC2::VPCGatewayAttachment",
	        "Properties" : {
		        "InternetGatewayId" : { "Ref" : "SyscoIGW" },
		        "VpcId" : { "Ref" : "vpcsyscononprod02" }
	        }
	    }, 
		"SyscoVPNGateway" : {
    	    "Type" : "AWS::EC2::VPNGateway",
        	"Properties" : {
            	"Type" : "ipsec.1",
	            "Tags" : [ 
					{ "Key" : "Name", "Value" : "vpg/vpc_sysco_nonprod_02/01" },
					{"Key" : "Application_Name", "Value": "AWS Foundation" },
					{ "Key" : "Environment", "Value": "Development" },
					{ "Key" : "Security_Classification", "Value" : "Confidential" },
					{ "Key" : "Cost_Center", "Value" : "USFBTECH PO 28843" },
					{ "Key" : "Application_Id", "Value" : "APP-001151" },
			        { "Key" : "Owner", "Value" : "Sheraz Khan" },
		    	    { "Key" : "Approver", "Value" : "Sheraz Khan" },
					{ "Key" : "System_Type", "Value": "Networking" },
					{ "Key" : "Support_Criticality", "Value" : "High" }
				]
        	}
    	},
	  	"AttachVpnGateway" : {
			"Type" : "AWS::EC2::VPCGatewayAttachment",
			"Properties" : {
				"VpcId" : { "Ref" : "vpcsyscononprod02" },
				"VpnGatewayId" : { "Ref" : "SyscoVPNGateway" }
			}
		}, 
		"VPNTunnel" : {
    	    "Type" : "AWS::EC2::VPNConnection",
        	"Properties" : {
            	"Type" : "ipsec.1",
	    	    "StaticRoutesOnly" : "true",
    	        "CustomerGatewayId" : {"Ref" : "SyscoCustGateway"},
        	    "VpnGatewayId" : {"Ref" : "SyscoVPNGateway"},
				"Tags" : [ 
					{ "Key" : "Name", "Value" : "vpn/vpc_sysco_nonprod_02/01" },
					{"Key" : "Application_Name", "Value": "AWS Foundation" },
					{ "Key" : "Environment", "Value": "Development" },
					{ "Key" : "Security_Classification", "Value" : "Confidential" },
					{ "Key" : "Cost_Center", "Value" : "USFBTECH PO 28843" },
			    	{ "Key" : "Application_Id", "Value" : "APP-001151" },
			        { "Key" : "Owner", "Value" : "Sheraz Khan" },
			        { "Key" : "Approver", "Value" : "Sheraz Khan" },
					{ "Key" : "System_Type", "Value": "Networking" },
					{ "Key" : "Support_Criticality", "Value" : "High" }
				]
        	}
    	},
    	"NAT1EIP" : {
		    "Type" : "AWS::EC2::EIP",
			"Properties" : {
				"Domain" : "vpc",
				"InstanceId" : { "Ref" : "LX238NonPRODNAT01" }
			}
		},
		"NAT2EIP" : {
			"Type" : "AWS::EC2::EIP",
			"Properties" : {
				"Domain" : "vpc",
				"InstanceId" : { "Ref" : "LX238NonPRODNAT02" }
			}
		}, 

		"LX238NonPRODNAT01" : {
			"Type" : "AWS::EC2::Instance",
			"Metadata" : {
				"Comment1" : "Create NAT #1"
			},
			"Properties" : {
				"InstanceType" : { "Ref" : "NATNodeInstanceType" } ,
				"KeyName" : { "Ref" : "PemKey" },
			    "IamInstanceProfile" : "Sysco-NATInstanceProfile-1B6IB42AG3NKL" ,
				"SubnetId" : { "Ref" : "PubSub2" },
				"SourceDestCheck" : "false",
				"ImageId" : { "Fn::FindInMap" : [ "AWSNATAMI", { "Ref" : "AWS::Region" }, "AMI" ]},
				"SecurityGroupIds" : [{ "Ref" : "NATSG"}, {"Ref" : "CheckMKClient" }],
				"Tags" : [ 
					{ "Key" : "Name", "Value": "lx238nonprodnat01" },
					{ "Key" : "Application_Name", "Value": "AWS Foundation" },
					{ "Key" : "Environment", "Value": "NonProduction" },
					{ "Key" : "Security_Classification", "Value" : "Confidential" },
					{ "Key" : "Cost_Center", "Value" : "USFBTECH PO 28842" },
					{ "Key" : "Owner", "Value" : "Sheraz Khan" },
					{ "Key" : "System_Type", "Value": "NAT" },
					{ "Key" : "Support_Criticality", "Value" : "High" },
					{ "Key" : "Application_Id", "Value" : "APP-001151" },
					{ "Key" : "Approver", "Value" : "Sheraz Khan" }
				],
				"UserData" : { 
				    "Fn::Base64" : { 
					    "Fn::Join" : ["", [
        				    "#!/bin/bash -v\n",
		            	    "yum update -y aws*\n",
            			    ". /etc/profile.d/aws-apitools-common.sh\n",
			        	    "# Configure iptables\n",
    	    	    	    "/sbin/iptables -t nat -A POSTROUTING -o eth0 -s 0.0.0.0/0 -j MASQUERADE\n",
	    	    	        "/sbin/iptables-save > /etc/sysconfig/iptables\n",
        			  	    "# Configure ip forwarding and redirects\n",
		        		    "echo 1 >  /proc/sys/net/ipv4/ip_forward && echo 0 >  /proc/sys/net/ipv4/conf/eth0/send_redirects\n",
			                "mkdir -p /etc/sysctl.d/\n",
    	    	    	    "cat <<EOF > /etc/sysctl.d/nat.conf\n",
	    	    	        "net.ipv4.ip_forward = 1\n",
            			    "net.ipv4.conf.eth0.send_redirects = 0\n",
			                "EOF\n",
        				    "# Download nat_monitor.sh and configure\n",
		        		    "cd /root\n",
			                "wget http://media.amazonwebservices.com/articles/nat_monitor_files/nat_monitor.sh\n",
    		        	    "# Wait for NAT #2 to boot up and update PrivateRouteTable2\n",
	        		        "sleep 180\n",
            			    "NAT_ID=\n",
			                "# CloudFormation should have updated the PrivateRouteTable2 by now (due to yum update), however loop to make sure\n",
            			    "while [ \"$NAT_ID\" == \"\" ]; do\n",
			                "  sleep 60\n",
            			    "  NAT_ID=`/opt/aws/bin/ec2-describe-route-tables ", { "Ref" : "PrivateRouteTable2" }, 
			        	    " -U https://ec2.", { "Ref" : "AWS::Region" }, ".amazonaws.com | grep 0.0.0.0/0 | awk '{print $2;}'`\n",
            			    "  #echo `date` \"-- NAT_ID=$NAT_ID\" >> /tmp/test.log\n",
            			    "done\n",
			                "# Update NAT_ID, NAT_RT_ID, and My_RT_ID\n",
            			    "sed \"s/NAT_ID=/NAT_ID=$NAT_ID/g\" /root/nat_monitor.sh > /root/nat_monitor.tmp\n",
			                "sed \"s/NAT_RT_ID=/NAT_RT_ID=",
        			            { "Ref" : "PrivateRouteTable2" },
		            	    "/g\" /root/nat_monitor.tmp > /root/nat_monitor.sh\n",
            			    "sed \"s/My_RT_ID=/My_RT_ID=",
			                    { "Ref" : "PrivateRouteTable2" },
            			    "/g\" /root/nat_monitor.sh > /root/nat_monitor.tmp\n",
			                "sed \"s/EC2_URL=/EC2_URL=https:\\/\\/ec2.",
            			        { "Ref" : "AWS::Region" }, ".amazonaws.com",
			                "/g\" /root/nat_monitor.tmp > /root/nat_monitor.sh\n",
            			    "sed \"s/Num_Pings=3/Num_Pings=",
			                    { "Ref" : "NumberOfPings" },
            			    "/g\" /root/nat_monitor.sh > /root/nat_monitor.tmp\n",
			                "sed \"s/Ping_Timeout=1/Ping_Timeout=",
            			        { "Ref" : "PingTimeout" },
			                "/g\" /root/nat_monitor.tmp > /root/nat_monitor.sh\n",
            			    "sed \"s/Wait_Between_Pings=2/Wait_Between_Pings=",
			                    { "Ref" : "WaitBetweenPings" },
            			    "/g\" /root/nat_monitor.sh > /root/nat_monitor.tmp\n",
			                "sed \"s/Wait_for_Instance_Stop=60/Wait_for_Instance_Stop=",
            			        { "Ref" : "WaitForInstanceStop" },
			                "/g\" /root/nat_monitor.tmp > /root/nat_monitor.sh\n",
            			    "sed \"s/Wait_for_Instance_Start=300/Wait_for_Instance_Start=",
			                    { "Ref" : "WaitForInstanceStart" },
            			    "/g\" /root/nat_monitor.sh > /root/nat_monitor.tmp\n",
			        	    "mv /root/nat_monitor.tmp /root/nat_monitor.sh\n",
				            "chmod a+x /root/nat_monitor.sh\n",
            			    "echo '@reboot /root/nat_monitor.sh > /tmp/nat_monitor.log' | crontab\n",
			                "/root/nat_monitor.sh > /tmp/nat_monitor.log &\n"
				            ]
						]
					}
				}
			}
		},
	"LX238NonPRODNAT02" : {
			"Type" : "AWS::EC2::Instance",
			"Metadata" : {
				"Comment1" : "Create NAT #2"
			},
			"Properties" : {
				"InstanceType" : { "Ref" : "NATNodeInstanceType" } ,
				"KeyName" : { "Ref" : "PemKey" },
				"IamInstanceProfile" : "Sysco-NATInstanceProfile-1B6IB42AG3NKL",
				"SubnetId" : { "Ref" : "NewPubSub1" },
				"SourceDestCheck" : "false",
				"ImageId" : { "Fn::FindInMap" : [ "AWSNATAMI", { "Ref" : "AWS::Region" }, "AMI" ]},
				"SecurityGroupIds" : [{ "Ref" : "NATSG"}, {"Ref" : "CheckMKClient" }],
				"Tags" : [ 
					{ "Key" : "Name", "Value": "lx238nonprodnat02" },
					{ "Key" : "Application_Name", "Value": "AWS Foundation" },
					{ "Key" : "Environment", "Value": "NonProduction" },
					{ "Key" : "Security_Classification", "Value" : "Confidential" },
					{ "Key" : "Cost_Center", "Value" : "USFBTECH PO 28842" },
					{ "Key" : "Owner", "Value" : "Sheraz Khan" },
					{ "Key" : "System_Type", "Value": "NAT" },
					{ "Key" : "Support_Criticality", "Value" : "High" },
					{ "Key" : "Application_Id", "Value" : "APP-001151" },
					{ "Key" : "Approver", "Value" : "Sheraz Khan" }
				],
				"UserData" : { 
				    "Fn::Base64" : { 
					    "Fn::Join" : ["", [
        				    "#!/bin/bash -v\n",
		            	    "yum update -y aws*\n",
				            "# Configure iptables\n",
            			    "/sbin/iptables -t nat -A POSTROUTING -o eth0 -s 0.0.0.0/0 -j MASQUERADE\n",
			                "/sbin/iptables-save > /etc/sysconfig/iptables\n",
        				    "# Configure ip forwarding and redirects\n",
		        		    "echo 1 >  /proc/sys/net/ipv4/ip_forward && echo 0 >  /proc/sys/net/ipv4/conf/eth0/send_redirects\n",
			                "mkdir -p /etc/sysctl.d/\n",
            			    "cat <<EOF > /etc/sysctl.d/nat.conf\n",
			                "net.ipv4.ip_forward = 1\n",
            			    "net.ipv4.conf.eth0.send_redirects = 0\n",
			                "EOF\n",
        				    "# Download nat_monitor.sh and configure\n",
		        		    "cd /root\n",
			                "wget http://media.amazonwebservices.com/articles/nat_monitor_files/nat_monitor.sh\n",
            			    "# Update NAT_ID, NAT_RT_ID, and My_RT_ID\n",
			                "sed \"s/NAT_ID=/NAT_ID=",
            			        { "Ref" : "LX238NonPRODNAT01" },
			                "/g\" /root/nat_monitor.sh > /root/nat_monitor.tmp\n",
            			    "sed \"s/NAT_RT_ID=/NAT_RT_ID=",
			                    { "Ref" : "PrivateRouteTable2" },
            			    "/g\" /root/nat_monitor.tmp > /root/nat_monitor.sh\n",
			                "sed \"s/My_RT_ID=/My_RT_ID=",
                			    { "Ref" : "PrivateRouteTable2" },
			                "/g\" /root/nat_monitor.sh > /root/nat_monitor.tmp\n",
            			    "sed \"s/EC2_URL=/EC2_URL=https:\\/\\/ec2.",
			                    { "Ref" : "AWS::Region" }, ".amazonaws.com",
            			    "/g\" /root/nat_monitor.tmp > /root/nat_monitor.sh\n",
			                "sed \"s/Num_Pings=3/Num_Pings=",
                			    { "Ref" : "NumberOfPings" },
			                "/g\" /root/nat_monitor.sh > /root/nat_monitor.tmp\n",
            			    "sed \"s/Ping_Timeout=1/Ping_Timeout=",
			                    { "Ref" : "PingTimeout" },
            			    "/g\" /root/nat_monitor.tmp > /root/nat_monitor.sh\n",
			                "sed \"s/Wait_Between_Pings=2/Wait_Between_Pings=",
                			    { "Ref" : "WaitBetweenPings" },
			                "/g\" /root/nat_monitor.sh > /root/nat_monitor.tmp\n",
            			    "sed \"s/Wait_for_Instance_Stop=60/Wait_for_Instance_Stop=",
			                    { "Ref" : "WaitForInstanceStop" },
            			    "/g\" /root/nat_monitor.tmp > /root/nat_monitor.sh\n",
			                "sed \"s/Wait_for_Instance_Start=300/Wait_for_Instance_Start=",
                			    { "Ref" : "WaitForInstanceStart" },
			                "/g\" /root/nat_monitor.sh > /root/nat_monitor.tmp\n",
        				    "mv /root/nat_monitor.tmp /root/nat_monitor.sh\n",
		        		    "chmod a+x /root/nat_monitor.sh\n",
			                "echo '@reboot /root/nat_monitor.sh > /tmp/nat_monitor.log' | crontab\n",
            			    "/root/nat_monitor.sh >> /tmp/nat_monitor.log &\n"
				            ]
						]
					}
				}
			}
		},

		"NATSecurityGroup" : {
			"Type" : "AWS::EC2::SecurityGroup",
			"Properties" : {
				"GroupDescription" : "Rules for allowing access to HA Nodes",
				"VpcId" : { "Ref" : "vpcsyscononprod02" },
				"SecurityGroupIngress" : [
				{ 
				    "IpProtocol" : "-1", 
					"FromPort" : "0",  
					"ToPort" : "65535",  
					"CidrIp" : { "Ref" : "VpcCidr" }
				}],
				"SecurityGroupEgress" : [
				{ 
				    "IpProtocol" : "-1", 
					"FromPort" : "0", 
					"ToPort" : "65535", 
					"CidrIp" : "0.0.0.0/0" 
				}],
				"Tags" : [ { "Key" : "Name", "Value" : "sg/vpc_sysco_nonprod_02/np_ha_nat" } ]
			}
		},
		"NATAllowICMP" : {
			"Type" : "AWS::EC2::SecurityGroupIngress",
			"Properties" : {
				"GroupId" : { "Ref" : "NATSecurityGroup" },
				"IpProtocol" : "tcp", 
			    "FromPort" : "443",  
			    "ToPort" : "443",  
			    "SourceSecurityGroupId" : { "Ref" : "NATSecurityGroup" }
			}
		},
		"PrivateRouteTable2" : {
    	    "Type" : "AWS::EC2::RouteTable",
        	"Properties" : {
            	"VpcId" : {"Ref" : "vpcsyscononprod02"},
			    "Tags" : [ { "Key" : "Name", "Value" : "rt/vpc_sysco_nonprod_02/confidential_02" } ]
    	    }
    	},
		"NewPeeringPrivateRoute2" : {
			"Type" : "AWS::EC2::Route",
			"Properties" : {
				"RouteTableId" : { "Ref" : "PrivateRouteTable2" },
				"DestinationCidrBlock" : "10.168.160.0/21",
				"VpcPeeringConnectionId" : "pcx-e73bd28e" 
			}
    	},
	    "NewPrivateRoute2" : {
    	    "Type" : "AWS::EC2::Route",
	    	"DependsOn" : "AttachVpnGateway",
        	"Properties" : {
	            "RouteTableId" : { "Ref" : "PrivateRouteTable2" },
                "DestinationCidrBlock" : "10.0.0.0/8",
				"GatewayId" : { "Ref" : "SyscoVPNGateway" }
        	}
    	}, 
		"SyscoCorpConnectionRoute" : {
			"Type" : "AWS::EC2::VPNConnectionRoute",
			"Properties" : {
				"DestinationCidrBlock" : "10.0.0.0/8",
				"VpnConnectionId" : {"Ref" : "VPNTunnel"}
			}
		},
		"snaz1vpcsyscononprod02cptuning" : {
			"Type" : "AWS::EC2::Subnet",
			"Properties" : {
				"VpcId" : { "Ref" : "vpcsyscononprod02" },
				"CidrBlock" : "10.168.128.0/26",
				"AvailabilityZone" : "us-east-1c",
				"Tags" : [ 
					{"Key" : "Name", "Value" : "sn_az1/vpc_sysco_nonprod_02/cp_tuning"},
					{"Key" : "Application_Name", "Value": "Cloud Pricing" },
					{ "Key" : "Environment", "Value": "Staging" },
					{ "Key" : "Security_Classification", "Value" : "Confidential" },
					{ "Key" : "Cost_Center", "Value" : "USFBTECH PO 28843" },
					{ "Key" : "System_Type", "Value": "Networking" },
					{ "Key" : "Support_Criticality", "Value" : "Low" },
					{ "Key" : "Application_Id", "Value" : "APP-001151" },
			        { "Key" : "Owner", "Value" : "Sheraz Khan" },
			        { "Key" : "Approver", "Value" : "Sheraz Khan" }
				]
			}
		},
		"snaz2vpcsyscononprod02cptuning" : {
			"Type" : "AWS::EC2::Subnet",
			"Properties" : {
				"VpcId" : { "Ref" : "vpcsyscononprod02" },
				"CidrBlock" : "10.168.128.64/26",
				"AvailabilityZone" : "us-east-1d",
				"Tags" : [ 
					{"Key" : "Name", "Value" : "sn_az2/vpc_sysco_nonprod_02/cp_tuning"},
					{"Key" : "Application_Name", "Value": "Cloud Pricing" },
					{ "Key" : "Environment", "Value": "Staging" },
					{ "Key" : "Security_Classification", "Value" : "Confidential" },
					{ "Key" : "Cost_Center", "Value" : "USFBTECH PO 28843" },
					{ "Key" : "System_Type", "Value": "Networking" },
					{ "Key" : "Support_Criticality", "Value" : "Low" },
    				{ "Key" : "Application_Id", "Value" : "APP-001151" },
		        	{ "Key" : "Owner", "Value" : "Sheraz Khan" },
			        { "Key" : "Approver", "Value" : "Sheraz Khan" }
				]
			}
		},
		"QualitySubnet1E1C" : {
			"Type" : "AWS::EC2::Subnet",
			"Properties" : {
				"VpcId" : { "Ref" : "vpcsyscononprod02" },
				"CidrBlock" : "10.168.128.160/27",
				"AvailabilityZone" : "us-east-1c",
				"Tags" : [ 
					{"Key" : "Name", "Value" : "sn_private1_useast1c/vpc_sysco_nonprod_02/cp_qa"},
					{"Key" : "Application_Name", "Value": "Cloud Pricing" },
					{ "Key" : "Environment", "Value": "Quality" },
					{ "Key" : "Security_Classification", "Value" : "Confidential" },
					{ "Key" : "Cost_Center", "Value" : "USFBTECH PO 28843" },
					{ "Key" : "System_Type", "Value": "Networking" },
					{ "Key" : "Support_Criticality", "Value" : "Low" },
					{ "Key" : "Application_Id", "Value" : "APP-001151" },
			        { "Key" : "Owner", "Value" : "Sheraz Khan" },
			        { "Key" : "Approver", "Value" : "Sheraz Khan" }
				]
			}
		},
		"ConfidentialSubnet1E" : {
			"Type" : "AWS::EC2::Subnet",
			"Properties" : {
				"VpcId" : { "Ref" : "vpcsyscononprod02" },
				"CidrBlock" : "10.168.133.0/23",
				"AvailabilityZone" : "us-east-1e",
				"Tags" : [ 
					{"Key" : "Name", "Value" : "sn_private1_useast1e/vpc_sysco_nonprod_02/confidential"},
					{"Key" : "Application_Name", "Value": "Base" },
					{ "Key" : "Environment", "Value": "NonProd" },
					{ "Key" : "Security_Classification", "Value" : "Confidential" },
					{ "Key" : "Cost_Center", "Value" : "USFBTECH PO 28843" },
					{ "Key" : "System_Type", "Value": "Networking" },
					{ "Key" : "Support_Criticality", "Value" : "Low" },
					{ "Key" : "Application_Id", "Value" : "APP-001151" },
			        { "Key" : "Owner", "Value" : "Sheraz Khan" },
			        { "Key" : "Approver", "Value" : "Sheraz Khan" }
				]
			}
		},
		"snaz1cvpcsyscononprod02confidential01" : {
			"Type" : "AWS::EC2::Subnet",
			"Properties" : {
				"VpcId" : { "Ref" : "vpcsyscononprod02" },
				"CidrBlock" : "10.168.138.0/23",
				"AvailabilityZone" : "us-east-1c",
				"Tags" : [ 
					{"Key" : "Name", "Value" : "sn_az1c/vpc_sysco_nonprod_02/confidential_01"},
					{"Key" : "Application_Name", "Value": "AWS Core" },
					{ "Key" : "Environment", "Value": "NonProd" },
					{ "Key" : "Security_Classification", "Value" : "Confidential" },
					{ "Key" : "Cost_Center", "Value" : "USFBTECH PO 28843" },
					{ "Key" : "System_Type", "Value": "Networking" },
					{ "Key" : "Support_Criticality", "Value" : "Low" },
    				{ "Key" : "Application_Id", "Value" : "APP-001151" },
		        	{ "Key" : "Owner", "Value" : "Sheraz Khan" },
			        { "Key" : "Approver", "Value" : "Sheraz Khan" }
				]
			}
		},
		"snaz1dvpcsyscononprod02confidential01" : {
			"Type" : "AWS::EC2::Subnet",
			"Properties" : {
				"VpcId" : { "Ref" : "vpcsyscononprod02" },
				"CidrBlock" : "10.168.140.0/23",
				"AvailabilityZone" : "us-east-1d",
				"Tags" : [ 
					{"Key" : "Name", "Value" : "sn_az1d/vpc_sysco_nonprod_02/confidential_01"},
					{"Key" : "Application_Name", "Value": "AWS Core" },
					{ "Key" : "Environment", "Value": "NonProd" },
					{ "Key" : "Security_Classification", "Value" : "Confidential" },
					{ "Key" : "Cost_Center", "Value" : "USFBTECH PO 28843" },
					{ "Key" : "System_Type", "Value": "Networking" },
					{ "Key" : "Support_Criticality", "Value" : "Low" },
    				{ "Key" : "Application_Id", "Value" : "APP-001151" },
		        	{ "Key" : "Owner", "Value" : "Sheraz Khan" },
			        { "Key" : "Approver", "Value" : "Sheraz Khan" }
				]
			}
		},
		"snaz1evpcsyscononprod02confidential01" : {
			"Type" : "AWS::EC2::Subnet",
			"Properties" : {
				"VpcId" : { "Ref" : "vpcsyscononprod02" },
				"CidrBlock" : "10.168.142.0/23",
				"AvailabilityZone" : "us-east-1e",
				"Tags" : [ 
					{"Key" : "Name", "Value" : "sn_az1e/vpc_sysco_nonprod_02/confidential_01"},
					{"Key" : "Application_Name", "Value": "AWS Core" },
					{ "Key" : "Environment", "Value": "NonProd" },
					{ "Key" : "Security_Classification", "Value" : "Confidential" },
					{ "Key" : "Cost_Center", "Value" : "USFBTECH PO 28843" },
					{ "Key" : "System_Type", "Value": "Networking" },
					{ "Key" : "Support_Criticality", "Value" : "Low" },
    				{ "Key" : "Application_Id", "Value" : "APP-001151" },
		        	{ "Key" : "Owner", "Value" : "Sheraz Khan" },
			        { "Key" : "Approver", "Value" : "Sheraz Khan" }
				]
			}
		},
		"snaz1cvpcsyscononprod02sensitive01" : {
			"Type" : "AWS::EC2::Subnet",
			"Properties" : {
				"VpcId" : { "Ref" : "vpcsyscononprod02" },
				"CidrBlock" : "10.168.135.0/24",
				"AvailabilityZone" : "us-east-1c",
				"Tags" : [ 
					{"Key" : "Name", "Value" : "sn_az1c/vpc_sysco_nonprod_02/sensitive_01"},
					{"Key" : "Application_Name", "Value": "AWS Core" },
					{ "Key" : "Environment", "Value": "NonProd" },
					{ "Key" : "Security_Classification", "Value" : "Confidential" },
					{ "Key" : "Cost_Center", "Value" : "USFBTECH PO 28843" },
					{ "Key" : "System_Type", "Value": "Networking" },
					{ "Key" : "Support_Criticality", "Value" : "Low" },
    				{ "Key" : "Application_Id", "Value" : "APP-001151" },
		        	{ "Key" : "Owner", "Value" : "Sheraz Khan" },
			        { "Key" : "Approver", "Value" : "Sheraz Khan" }
				]
			}
		},
		"snaz1dvpcsyscononprod02sensitive01" : {
			"Type" : "AWS::EC2::Subnet",
			"Properties" : {
				"VpcId" : { "Ref" : "vpcsyscononprod02" },
				"CidrBlock" : "10.168.136.0/24",
				"AvailabilityZone" : "us-east-1d",
				"Tags" : [ 
					{"Key" : "Name", "Value" : "sn_az1d/vpc_sysco_nonprod_02/sensitive_01"},
					{"Key" : "Application_Name", "Value": "AWS Core" },
					{ "Key" : "Environment", "Value": "NonProd" },
					{ "Key" : "Security_Classification", "Value" : "Confidential" },
					{ "Key" : "Cost_Center", "Value" : "USFBTECH PO 28843" },
					{ "Key" : "System_Type", "Value": "Networking" },
					{ "Key" : "Support_Criticality", "Value" : "Low" },
    				{ "Key" : "Application_Id", "Value" : "APP-001151" },
		        	{ "Key" : "Owner", "Value" : "Sheraz Khan" },
			        { "Key" : "Approver", "Value" : "Sheraz Khan" }
				]
			}
		},
		"snaz1evpcsyscononprod02sensitive01" : {
			"Type" : "AWS::EC2::Subnet",
			"Properties" : {
				"VpcId" : { "Ref" : "vpcsyscononprod02" },
				"CidrBlock" : "10.168.137.0/24",
				"AvailabilityZone" : "us-east-1e",
				"Tags" : [ 
					{"Key" : "Name", "Value" : "sn_az1e/vpc_sysco_nonprod_02/sensitive_01"},
					{"Key" : "Application_Name", "Value": "AWS Core" },
					{ "Key" : "Environment", "Value": "NonProd" },
					{ "Key" : "Security_Classification", "Value" : "Confidential" },
					{ "Key" : "Cost_Center", "Value" : "USFBTECH PO 28843" },
					{ "Key" : "System_Type", "Value": "Networking" },
					{ "Key" : "Support_Criticality", "Value" : "Low" },
    				{ "Key" : "Application_Id", "Value" : "APP-001151" },
		        	{ "Key" : "Owner", "Value" : "Sheraz Khan" },
			        { "Key" : "Approver", "Value" : "Sheraz Khan" }
				]
			}
		},
		"ConfidentialPrivateRouteTable1" : {
			"Type" : "AWS::EC2::RouteTable",
			"Properties" : {
				"VpcId" : {"Ref" : "vpcsyscononprod02"},
				"Tags" : [ { "Key" : "Name", "Value" : "rt/vpc_sysco_nonprod_02/confidential" } ]
			}
		},

		"ConfidentialPrivateRoute1" : {
    	    "Type" : "AWS::EC2::Route",
	    	"DependsOn" : "AttachVpnGateway",
	        "Properties" : {
   	            "RouteTableId" : { "Ref" : "ConfidentialPrivateRouteTable1" },
                "DestinationCidrBlock" : "0.0.0.0/0",
                "InstanceId" : { "Ref" : "LX238NonPRODNAT01" }
        	}
    	},
		"ConfidentialPrivateRoute2" : {
    	    "Type" : "AWS::EC2::Route",
	    	"DependsOn" : "AttachVpnGateway",
	        "Properties" : {
   	            "RouteTableId" : { "Ref" : "ConfidentialPrivateRouteTable1" },
                "DestinationCidrBlock" : "10.0.0.0/8",
			    "GatewayId" : { "Ref" : "SyscoVPNGateway" }
        	}
    	},
	    "ConfidentialPrivateSubnetRouteTableAssociation1" : {
   		    "Type" : "AWS::EC2::SubnetRouteTableAssociation",
        	"Properties" : {
            	"SubnetId" : { "Ref" : "ConfidentialSubnet1E" },
            	"RouteTableId" : { "Ref" : "ConfidentialPrivateRouteTable1" }
        	}
    	},
		"ConfidentialPrivateSubnetRouteTableAssociation2" : {
   		    "Type" : "AWS::EC2::SubnetRouteTableAssociation",
        	"Properties" : {
            	"SubnetId" : { "Ref" : "snaz1cvpcsyscononprod02confidential01" },
            	"RouteTableId" : { "Ref" : "ConfidentialPrivateRouteTable1" }
        	}
    	},
		"ConfidentialPrivateSubnetRouteTableAssociation3" : {
   		    "Type" : "AWS::EC2::SubnetRouteTableAssociation",
        	"Properties" : {
            	"SubnetId" : { "Ref" : "snaz1dvpcsyscononprod02confidential01" },
            	"RouteTableId" : { "Ref" : "ConfidentialPrivateRouteTable1" }
        	}
    	},
		"ConfidentialPrivateSubnetRouteTableAssociation4" : {
   		    "Type" : "AWS::EC2::SubnetRouteTableAssociation",
        	"Properties" : {
            	"SubnetId" : { "Ref" : "snaz1evpcsyscononprod02confidential01" },
            	"RouteTableId" : { "Ref" : "ConfidentialPrivateRouteTable1" }
        	}
    	},
		"ConfidentialPrivateSubnetRouteTableAssociation5" : {
   		    "Type" : "AWS::EC2::SubnetRouteTableAssociation",
        	"Properties" : {
            	"SubnetId" : { "Ref" : "snaz1cvpcsyscononprod02sensitive01" },
            	"RouteTableId" : { "Ref" : "ConfidentialPrivateRouteTable1" }
        	}
    	},
		"ConfidentialPrivateSubnetRouteTableAssociation6" : {
   		    "Type" : "AWS::EC2::SubnetRouteTableAssociation",
        	"Properties" : {
            	"SubnetId" : { "Ref" : "snaz1dvpcsyscononprod02sensitive01" },
            	"RouteTableId" : { "Ref" : "ConfidentialPrivateRouteTable1" }
        	}
    	},
		"ConfidentialPrivateSubnetRouteTableAssociation7" : {
   		    "Type" : "AWS::EC2::SubnetRouteTableAssociation",
        	"Properties" : {
            	"SubnetId" : { "Ref" : "snaz1evpcsyscononprod02sensitive01" },
            	"RouteTableId" : { "Ref" : "ConfidentialPrivateRouteTable1" }
        	}
    	},
		"QualityPrivateRouteTable1" : {
			"Type" : "AWS::EC2::RouteTable",
			"Properties" : {
				"VpcId" : {"Ref" : "vpcsyscononprod02"},
				"Tags" : [ { "Key" : "Name", "Value" : "rt/vpc_sysco_nonprod_02/cp_qa" } ]
			}
		},
	    "QualityPrivateRoute1" : {
    	    "Type" : "AWS::EC2::Route",
	    	"DependsOn" : "AttachVpnGateway",
	        "Properties" : {
   	            "RouteTableId" : { "Ref" : "QualityPrivateRouteTable1" },
                "DestinationCidrBlock" : "0.0.0.0/0",
                "InstanceId" : { "Ref" : "LX238NonPRODNAT01" }
        	}
    	},
	    "QualityPrivateRoute2" : {
    	    "Type" : "AWS::EC2::Route",
	    	"DependsOn" : "AttachVpnGateway",
	        "Properties" : {
   	            "RouteTableId" : { "Ref" : "QualityPrivateRouteTable1" },
                "DestinationCidrBlock" : "10.0.0.0/8",
				"GatewayId" : { "Ref" : "SyscoVPNGateway" }
        	}
    	},
	    "QualityPrivateSubnetRouteTableAssociation1" : {
   		    "Type" : "AWS::EC2::SubnetRouteTableAssociation",
        	"Properties" : {
            	"SubnetId" : { "Ref" : "QualitySubnet1E1C" },
            	"RouteTableId" : { "Ref" : "QualityPrivateRouteTable1" }
        	}
    	},
		"PeeringQualityRoute" : {
			"Type" : "AWS::EC2::Route",
			"Properties" : {
				"RouteTableId" : { "Ref" : "QualityPrivateRouteTable1" },
				"DestinationCidrBlock" : "10.168.160.0/21",
				"VpcPeeringConnectionId" : "pcx-e73bd28e" 
			}
   	    },
	    "QualityDBSG": {
    	    "Type": "AWS::EC2::SecurityGroup",
        	"DependsOn": ["vpcsyscononprod02"] ,
	        "Properties": {
    	        "GroupDescription": "Quality database services security group",
        	    "VpcId": {
            	    "Ref": "vpcsyscononprod02"
            	},
            	"SecurityGroupIngress": [
            	{
            	    "IpProtocol": "tcp",
                	"FromPort": "3389",
	                "ToPort": "3389",
    	            "CidrIp": "10.0.0.0/8"
        	    },
            	{
                	"IpProtocol": "tcp",
	                "FromPort": "1433",
    	            "ToPort": "1433",
        	        "CidrIp": "10.0.0.0/8"
            	},
            	{
	                "IpProtocol": "-1",
    	            "FromPort": "-1",
        	        "ToPort": "-1",
            	    "SourceSecurityGroupId": {
                	    "Ref": "QualityWEBSG"
                	}
            	}],
            	"Tags": [
            	{
                	"Key": "Name",
	                "Value": "sg/vpc_sysco_nonprod_02/cp_db_qa"
    	        }]
        	}
    	},	
		"IngressAdder4":{
			"DependsOn": "QualityDBSG",
			"Type": "AWS::EC2::SecurityGroupIngress",
			"Properties":
			{
				"FromPort" : "-1",
				"GroupId" : {"Ref":"QualityDBSG"},
				"IpProtocol" : "-1",
				"SourceSecurityGroupId" : {"Ref":"QualityDBSG"},
				"ToPort" : "-1"
			}
		},
		"PrivateRouteTable" : {
    	    "Type" : "AWS::EC2::RouteTable",
        	"Properties" : {
            	"VpcId" : {"Ref" : "vpcsyscononprod02"},
			    "Tags" : [ { "Key" : "Name", "Value" : "rt/vpc_sysco_nonprod_02/cp_tuning" } ]
    	    }
    	},
		"PeeringTuningRoute" : {
			"Type" : "AWS::EC2::Route",
			"Properties" : {
				"RouteTableId" : { "Ref" : "PrivateRouteTable" },
				"DestinationCidrBlock" : "10.168.160.0/21",
				"VpcPeeringConnectionId" : "pcx-e73bd28e" 
			}
    	},
	    "PrivateRoute" : {
    	    "Type" : "AWS::EC2::Route",
	    	"DependsOn" : "AttachVpnGateway",
        	"Properties" : {
	            "RouteTableId" : { "Ref" : "PrivateRouteTable" },
                "DestinationCidrBlock" : "0.0.0.0/0",
                "InstanceId" : { "Ref" : "LX238NonPRODNAT01" }
        	}
    	},   
	    "PrivateRoute2" : {
    	    "Type" : "AWS::EC2::Route",
	    	"DependsOn" : "AttachVpnGateway",
        	"Properties" : {
	            "RouteTableId" : { "Ref" : "PrivateRouteTable" },
                "DestinationCidrBlock" : "10.0.0.0/8",
				"GatewayId" : { "Ref" : "SyscoVPNGateway" }
        	}
    	},   
	    "PrivateSubnetRouteTableAssociation1" : {
    	    "Type" : "AWS::EC2::SubnetRouteTableAssociation",
        	"Properties" : {
            	"SubnetId" : { "Ref" : "snaz1vpcsyscononprod02cptuning" },
	            "RouteTableId" : { "Ref" : "PrivateRouteTable" }
    	    }
    	},
	    "PrivateSubnetRouteTableAssociation2" : {
    	    "Type" : "AWS::EC2::SubnetRouteTableAssociation",
        	"Properties" : {
            	"SubnetId" : { "Ref" : "snaz2vpcsyscononprod02cptuning" },
	            "RouteTableId" : { "Ref" : "PrivateRouteTable" }
    	    }
    	},
	    "WEBSG" : {
    	    "Type" : "AWS::EC2::SecurityGroup",
	    	"DependsOn": "vpcsyscononprod02",
	        "Properties" : {
    	        "GroupDescription" : "Web services security group",
	    	    "VpcId" : { "Ref" : "vpcsyscononprod02" },
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
			    "Tags" : [ { "Key" : "Name", "Value" : "sg/vpc_sysco_nonprod_02/cp_web_tuning" } ]
        	}   
    	},
		"IngressAdder":{
			"DependsOn": "WEBSG",
			"Type": "AWS::EC2::SecurityGroupIngress",
			"Properties":
			{
				"FromPort" : "-1",
				"GroupId" : {"Ref":"WEBSG"},
				"IpProtocol" : "-1",
				"SourceSecurityGroupId" : {"Ref":"WEBSG"},
				"ToPort" : "-1"
			}	
		},
	    "DBSG": {
    	    "Type": "AWS::EC2::SecurityGroup",
        	"DependsOn": ["vpcsyscononprod02"] ,
	        "Properties": {
    	        "GroupDescription": "Database services security group",
        	    "VpcId": {
                	"Ref": "vpcsyscononprod02"
            	},
	            "SecurityGroupIngress": [
    	        {
        	        "IpProtocol": "tcp",
            	    "FromPort": "3389",
                	"ToPort": "3389",
	                "CidrIp": "10.0.0.0/8"
    	        },
        	    {
            	    "IpProtocol": "tcp",
                	"FromPort": "1433",
	                "ToPort": "1433",
    	            "CidrIp": "10.0.0.0/8"
        	    },
            	{
                	"IpProtocol": "-1",
	                "FromPort": "-1",
    	            "ToPort": "-1",
        	        "SourceSecurityGroupId": {
            	        "Ref": "WEBSG"
                	}
            	}],
	            "Tags": [
    	        {
        	        "Key": "Name",
            	    "Value": "sg/vpc_sysco_nonprod_02/cp_db_tuning"
            	}]
        	}
    	},
		"IngressAdder2":{
			"DependsOn": "DBSG",
			"Type": "AWS::EC2::SecurityGroupIngress",
			"Properties":
			{
			    "FromPort" : "-1",
		    	"GroupId" : {"Ref":"DBSG"},
			    "IpProtocol" : "-1",
			    "SourceSecurityGroupId" : {"Ref":"DBSG"},
			    "ToPort" : "-1"
			}
		},
		"MS238CPAC01s": {
		    "Type" : "AWS::EC2::Instance",
	    	"Properties" : {
			    "AvailabilityZone" : "us-east-1c",
			    "DisableApiTermination" : "true",
			    "ImageId" : "ami-b68658de",
		    	"InstanceType" : "m1.small",
			    "KeyName" : {"Ref" : "PemKey"},
			    "PrivateIpAddress" : "10.168.128.55",
			    "SecurityGroupIds" : [{ "Ref" : "WEBSG" }, {"Ref" : "CheckMKClient" }],
		    	"SubnetId" : { "Ref" : "snaz1vpcsyscononprod02cptuning" },
			    "Tags" : [ 
			        { "Key" : "Name", "Value": "MS238CPAC01s" },
			        { "Key" : "Application_Name", "Value": "Cloud Pricing" },
		    	    { "Key" : "Environment", "Value": "Staging" },
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
		"MS238CPSQL01s": {
		    "Type" : "AWS::EC2::Instance",
	    	"Properties" : {
		    	"AvailabilityZone" : "us-east-1c",
			    "DisableApiTermination" : "true",
			    "ImageId" : "ami-3a875952",
			    "InstanceType" : "m3.xlarge",
		    	"KeyName" : {"Ref" : "PemKey"},
			    "PrivateIpAddress" : "10.168.128.7",
			    "SecurityGroupIds" : [{ "Ref" : "DBSG" }],
			    "SubnetId" : { "Ref" : "snaz1vpcsyscononprod02cptuning" },
		    	"Tags" : [ 
			        { "Key" : "Name", "Value": "MS238CPSQL01s" },
			        { "Key" : "Application_Name", "Value": "Cloud Pricing" },
			        { "Key" : "Environment", "Value": "Staging" },
		    	    { "Key" : "Security_Classification", "Value" : "Confidential" },
		        	{ "Key" : "Cost_Center", "Value" : "USFBTECH PO 28843" },
			        { "Key" : "System_Type", "Value": "Database" },
			        { "Key" : "Support_Criticality", "Value" : "Low" },
			        { "Key" : "Application_Id", "Value" : "APP-001151" },
		    	    { "Key" : "Owner", "Value" : "Sheraz Khan" },
		        	{ "Key" : "Approver", "Value" : "Sheraz Khan" }
		    	]
			}
		},
		"MS238CPSQL02s": {
		    "Type" : "AWS::EC2::Instance",
	    	"Properties" : {
		    	"AvailabilityZone" : "us-east-1d",
			    "DisableApiTermination" : "true",
			    "ImageId" : "ami-3a875952",
			    "InstanceType" : "m3.xlarge",
		    	"KeyName" : {"Ref" : "PemKey"},
			    "PrivateIpAddress" : "10.168.128.72",
			    "SecurityGroupIds" : [{ "Ref" : "DBSG" }],
			    "SubnetId" : { "Ref" : "snaz2vpcsyscononprod02cptuning" },
		    	"Tags" : [ 
		        	{ "Key" : "Name", "Value": "MS238CPSQL02s" },
			        { "Key" : "Application_Name", "Value": "Cloud Pricing" },
			        { "Key" : "Environment", "Value": "Staging" },
			        { "Key" : "Security_Classification", "Value" : "Confidential" },
		    	    { "Key" : "Cost_Center", "Value" : "USFBTECH PO 28843" },
		        	{ "Key" : "System_Type", "Value": "Database" },
			        { "Key" : "Support_Criticality", "Value" : "Low" },
			        { "Key" : "Application_Id", "Value" : "APP-001151" },
			        { "Key" : "Owner", "Value" : "Sheraz Khan" },
		    	    { "Key" : "Approver", "Value" : "Sheraz Khan" }
		    	]
			}
		},



		"MS238CPBTSQL06s": {
		    "Type" : "AWS::EC2::Instance",
	    	"Properties" : {
		    	"AvailabilityZone" : "us-east-1c",
			    "DisableApiTermination" : "true",
			    "ImageId" : "ami-5c2dbc34",
			    "InstanceType" : "m3.xlarge",
		    	"KeyName" : {"Ref" : "PemKey"},
			    "SecurityGroupIds" : [{ "Ref" : "DBSG" }, {"Ref" : "CheckMKClient" }],
			    "SubnetId" : { "Ref" : "snaz1vpcsyscononprod02cptuning" },
			    "Tags" : [ 
		    	    { "Key" : "Name", "Value": "MS238CPBTSQL06s" },
		        	{ "Key" : "Application_Name", "Value": "Cloud Pricing" },
			        { "Key" : "Application_Id", "Value" : "APP-001151" },
			        { "Key" : "Owner", "Value" : "Sheraz Khan" },
			        { "Key" : "Approver", "Value" : "Sheraz Khan" },
		    	    { "Key" : "Environment", "Value": "Staging" },
		        	{ "Key" : "Security_Classification", "Value" : "Confidential" },
			        { "Key" : "Cost_Center", "Value" : "USFBTECH PO 28843" },
			        { "Key" : "System_Type", "Value": "Database" },
			        { "Key" : "Support_Criticality", "Value" : "Low" }
		    	]
			}
		},
		"MS238CPBTSQL07s": {
		    "Type" : "AWS::EC2::Instance",
	    	"Properties" : {
		    	"AvailabilityZone" : "us-east-1d",
			    "DisableApiTermination" : "true",
			    "ImageId" : "ami-5c2dbc34",
			    "InstanceType" : "m3.xlarge",
		    	"KeyName" : {"Ref" : "PemKey"},
			    "SecurityGroupIds" : [{ "Ref" : "DBSG" }, {"Ref" : "CheckMKClient" }],
			    "SubnetId" : { "Ref" : "snaz2vpcsyscononprod02cptuning" },
			    "Tags" : [ 
		    	    { "Key" : "Name", "Value": "MS238CPBTSQL07s" },
		        	{ "Key" : "Application_Name", "Value": "Cloud Pricing" },
			        { "Key" : "Application_Id", "Value" : "APP-001151" },
			        { "Key" : "Owner", "Value" : "Sheraz Khan" },
			        { "Key" : "Approver", "Value" : "Sheraz Khan" },
		    	    { "Key" : "Environment", "Value": "Staging" },
		        	{ "Key" : "Security_Classification", "Value" : "Confidential" },
			        { "Key" : "Cost_Center", "Value" : "USFBTECH PO 28843" },
			        { "Key" : "System_Type", "Value": "Database" },
			        { "Key" : "Support_Criticality", "Value" : "Low" }
		    	]
			}
		},
		"MS238CPODSQL06s": {
		    "Type" : "AWS::EC2::Instance",
	    	"Properties" : {
			    "AvailabilityZone" : "us-east-1c",
			    "DisableApiTermination" : "true",
			    "ImageId" : "ami-5c2dbc34",
		    	"InstanceType" : "m3.xlarge",
			    "KeyName" : {"Ref" : "PemKey"},
			    "SecurityGroupIds" : [{ "Ref" : "DBSG"} , {"Ref" : "CheckMKClient" }],
			    "SubnetId" : { "Ref" : "snaz1vpcsyscononprod02cptuning" },
		    	"Tags" : [ 
		        	{ "Key" : "Name", "Value": "MS238CPODSQL06s" },
			        { "Key" : "Application_Name", "Value": "Cloud Pricing" },
			        { "Key" : "Application_Id", "Value" : "APP-001151" },
			        { "Key" : "Owner", "Value" : "Sheraz Khan" },
		    	    { "Key" : "Approver", "Value" : "Sheraz Khan" },
		        	{ "Key" : "Environment", "Value": "Staging" },
			        { "Key" : "Security_Classification", "Value" : "Confidential" },
			        { "Key" : "Cost_Center", "Value" : "USFBTECH PO 28843" },
			        { "Key" : "System_Type", "Value": "Database" },
		    	    { "Key" : "Support_Criticality", "Value" : "Low" }
		    	]
			}
		},
		"MS238CPODSQL07s": {
		    "Type" : "AWS::EC2::Instance",
	    	"Properties" : {
	  	    	"AvailabilityZone" : "us-east-1d",
			    "DisableApiTermination" : "true",
			    "ImageId" : "ami-5c2dbc34",
			    "InstanceType" : "m3.xlarge",
		    	"KeyName" : {"Ref" : "PemKey"},
			    "SecurityGroupIds" : [{ "Ref" : "DBSG" }, {"Ref" : "CheckMKClient" }],
			    "SubnetId" : { "Ref" : "snaz2vpcsyscononprod02cptuning" },
			    "Tags" : [ 
		    	    { "Key" : "Name", "Value": "MS238CPODSQL07s" },
		        	{ "Key" : "Application_Name", "Value": "Cloud Pricing" },
			        { "Key" : "Application_Id", "Value" : "APP-001151" },
			        { "Key" : "Owner", "Value" : "Sheraz Khan" },
			        { "Key" : "Approver", "Value" : "Sheraz Khan" },
		    	    { "Key" : "Environment", "Value": "Staging" },
		        	{ "Key" : "Security_Classification", "Value" : "Confidential" },
			        { "Key" : "Cost_Center", "Value" : "USFBTECH PO 28843" },
			        { "Key" : "System_Type", "Value": "Database" },
			        { "Key" : "Support_Criticality", "Value" : "Low" }
		    	]
			}
		},
		"DevSubnet1E1C" : {
			"Type" : "AWS::EC2::Subnet",
			"Properties" : {
				"VpcId" : { "Ref" : "vpcsyscononprod02" },
				"CidrBlock" : "10.168.128.128/27",
				"AvailabilityZone" : "us-east-1c",
				"Tags" : [ 
					{"Key" : "Name", "Value" : "sn_private1_useast1c/vpc_sysco_nonprod_02/cp_dev"},
					{"Key" : "Application_Name", "Value": "Cloud Pricing" },
					{ "Key" : "Environment", "Value": "Staging" },
					{ "Key" : "Security_Classification", "Value" : "Confidential" },
					{ "Key" : "Cost_Center", "Value" : "USFBTECH PO 28843" },
					{ "Key" : "System_Type", "Value": "Networking" },
					{ "Key" : "Support_Criticality", "Value" : "Low" },
			        { "Key" : "Application_Id", "Value" : "APP-001151" },
		    	    { "Key" : "Owner", "Value" : "Sheraz Khan" },
		        	{ "Key" : "Approver", "Value" : "Sheraz Khan" }
				]
			}
    	},
		"DevPrivateRouteTable1" : {
			"Type" : "AWS::EC2::RouteTable",
			"Properties" : {
				"VpcId" : {"Ref" : "vpcsyscononprod02"},
				"Tags" : [ { "Key" : "Name", "Value" : "rt/vpc_sysco_nonprod_02/cp_dev" } ]
			}
		},
		"DevPrivateRoute3" : {
            "Type" : "AWS::EC2::Route",
            "Properties" : {
                "RouteTableId" : { "Ref" : "DevPrivateRouteTable1" },
                "DestinationCidrBlock" : "0.0.0.0/0",
                "InstanceId" : { "Ref" : "LX238NonPRODNAT01" }
            }
        },
        "DevPrivateRoute2" : {
            "Type" : "AWS::EC2::Route",
            "DependsOn" : "AttachVpnGateway",
            "Properties" : {
                "RouteTableId" : { "Ref" : "DevPrivateRouteTable1" },
                "DestinationCidrBlock" : "10.0.0.0/8",
                "GatewayId" : { "Ref" : "SyscoVPNGateway" }
            }
        }, 
        "NATSG" : {
            "Type" : "AWS::EC2::SecurityGroup",
            "Properties" : {
                "GroupDescription" : "NAT SG",
                "VpcId" : { "Ref" : "vpcsyscononprod02" },
                "SecurityGroupIngress" : [
                { 
				    "IpProtocol" : "tcp", 
					"FromPort" : "443",  
					"ToPort" : "443",  
					"SourceSecurityGroupId": {"Ref": "NatAccessParam"}
			    },
                { 
				    "IpProtocol" : "tcp", 
					"FromPort" : "80",  
					"ToPort" : "80",  
					"SourceSecurityGroupId": {"Ref": "NatAccessParam"}
			    },
                { 
				    "IpProtocol" : "tcp", 
					"FromPort" : "22",  
					"ToPort" : "22",  
					"SourceSecurityGroupId": {"Ref": "NatAccessParam"}
			    },
                { 
				    "IpProtocol" : "tcp", 
					"FromPort" : "21",  
					"ToPort" : "21",  
					"SourceSecurityGroupId": {"Ref": "NatAccessParam"}
			    }		    			    			    ],
                "Tags" : [ { "Key" : "Name", "Value" : "sg/vpc_sysco_nonprod_02/nat" } ]
            }
        },
		"IngressAdder11":{
			"DependsOn": "DevDBSG",
			"Type": "AWS::EC2::SecurityGroupIngress",
			"Properties":
			{
			    "FromPort" : "-1",
				"GroupId" : {"Ref":"NATSG"},
				"IpProtocol" : "-1",
				"SourceSecurityGroupId" : {"Ref":"NATSG"},
				"ToPort" : "-1"
			}
		},
        "NatAccess" : {
            "Type" : "AWS::EC2::SecurityGroup",
            "Properties" : {
                "GroupDescription" : "NAT Access SG",
                "VpcId" : { "Ref" : "vpcsyscononprod02" },
                "SecurityGroupEgress" : [
            	{
                	"IpProtocol": "-1",
	                "FromPort": "-1",
    	            "ToPort": "-1",
        	        "SourceSecurityGroupId": {
            	        "Ref": "NATSG"
                	}  
			    }],
                "Tags" : [ { "Key" : "Name", "Value" : "sg/vpc_sysco_nonprod_02/nataccess" } ]
            }
        },
        "NAT1EIP" : {
            "Type" : "AWS::EC2::EIP",
            "Properties" : {
                "Domain" : "vpc",
                "InstanceId" : { "Ref" : "LX238DEVNAT01" }
            }
        },
        "LX238DEVNAT01": {
            "Type" : "AWS::EC2::Instance",
            "Properties" : {
                "AvailabilityZone" : "us-east-1c",
                "DisableApiTermination" : "true",
                "ImageId" : "ami-184dc970",
                "InstanceType" : "t2.micro",
                "KeyName" : {"Ref" : "PemKey"},
                "SecurityGroupIds" : [{ "Ref" : "NATSG" }, {"Ref" : "CheckMKClient" }],
                "SubnetId" : { "Ref" : "PubSub2" },
                "Tags" : [ 
                    { "Key" : "Name", "Value": "LX238DEVNAT01" },
                    { "Key" : "Application_Name", "Value": "Network" },
                    { "Key" : "Environment", "Value": "ALL" },
                    { "Key" : "Security_Classification", "Value" : "Confidential" },
                    { "Key" : "Cost_Center", "Value" : "USFBTECH PO 28843" },
                    { "Key" : "System_Type", "Value": "NAT Server" },
                    { "Key" : "Support_Criticality", "Value" : "Low" },
                    { "Key" : "Application_Id", "Value" : "APP-001151" },
                    { "Key" : "Owner", "Value" : "Sheraz Khan" },
                    { "Key" : "Approver", "Value" : "Sheraz Khan" }
                ]
            }
        },
        "PubSub2" : {
            "Type" : "AWS::EC2::Subnet",
            "Properties" : {
                "VpcId" : { "Ref" : "vpcsyscononprod02" },
                "CidrBlock" : "10.168.130.0/27",
                "AvailabilityZone" : "us-east-1c",
                "Tags" : [ 
                    {"Key" : "Name", "Value" : "sn_public1_useast1c/vpc_sysco_nonprod_02/public"},
                    {"Key" : "Application_Name", "Value": "ALL" },
                    { "Key" : "Environment", "Value": "ALL" },
                    { "Key" : "Security_Classification", "Value" : "Confidential" },
                    { "Key" : "Cost_Center", "Value" : "USFBTECH PO 28843" },
                    { "Key" : "System_Type", "Value": "Networking" },
                    { "Key" : "Support_Criticality", "Value" : "Low" },
                    { "Key" : "Application_Id", "Value" : "APP-001151" },
                    { "Key" : "Owner", "Value" : "Sheraz Khan" },
                    { "Key" : "Approver", "Value" : "Sheraz Khan" }
                ]
            }
        },
        "PubRT1" : {
            "Type" : "AWS::EC2::RouteTable",
            "Properties" : {
                "VpcId" : {"Ref" : "vpcsyscononprod02"},
                "Tags" : [ { "Key" : "Name", "Value" : "rt/vpc_sysco_nonprod_02/pub" } ]
            }
        },
        "PubSubAssoc1" : {
            "Type" : "AWS::EC2::SubnetRouteTableAssociation",
            "Properties" : {
                "SubnetId" : { "Ref" : "PubSub2" },
                "RouteTableId" : { "Ref" : "PubRT1" }
            }
        },
        "PublicRoute1" : {
            "Type" : "AWS::EC2::Route",
            "Properties" : {
                "RouteTableId" : { "Ref" : "PubRT1" },
                "DestinationCidrBlock" : "0.0.0.0/0",
                "GatewayId" : { "Ref" : "SyscoIGW" }
            }
        },
        "PublicRoute2" : {
            "Type" : "AWS::EC2::Route",
            "Properties" : {
                "RouteTableId" : { "Ref" : "PubRT1" },
                "DestinationCidrBlock" : "10.0.0.0/8",
				"GatewayId" : { "Ref" : "SyscoVPNGateway" }
            }
        },
        "NewPubSubAssoc1" : {
            "Type" : "AWS::EC2::SubnetRouteTableAssociation",
            "Properties" : {
                "SubnetId" : { "Ref" : "NewPubSub1" },
                "RouteTableId" : { "Ref" : "PubRT1" }
            }
        },
		"DevPrivateSubnetRouteTableAssociation1" : {
			"Type" : "AWS::EC2::SubnetRouteTableAssociation",
			"Properties" : {
		    	"SubnetId" : { "Ref" : "DevSubnet1E1C" },
				"RouteTableId" : { "Ref" : "DevPrivateRouteTable1" }
			}
    	},
		"PeeringDevRoute" : {
	 		"Type" : "AWS::EC2::Route",
			"Properties" : {
				"RouteTableId" : { "Ref" : "DevPrivateRouteTable1" },
				"DestinationCidrBlock" : "10.168.160.0/21",
				"VpcPeeringConnectionId" : "pcx-e73bd28e" 
			}
		},

		"PublicPeeringRoute" : {
	 		"Type" : "AWS::EC2::Route",
			"Properties" : {
				"RouteTableId" : { "Ref" : "PubRT1" },
				"DestinationCidrBlock" : "10.168.160.0/21",
				"VpcPeeringConnectionId" : "pcx-e73bd28e" 
			}
		},		
		"DevDBSG": {
			"Type": "AWS::EC2::SecurityGroup",
			"Properties": {
				"GroupDescription": "Dev database services security group",
				"VpcId": {"Ref": "vpcsyscononprod02"},
				"SecurityGroupIngress": [
				{
					"IpProtocol": "tcp",
					"FromPort": "3389",
					"ToPort": "3389",
					"CidrIp": "10.0.0.0/8"
				},
				{
					"IpProtocol": "tcp",
					"FromPort": "1433",
					"ToPort": "1433",
					"CidrIp": "10.0.0.0/8"
				},
				{
					"IpProtocol": "tcp",
					"FromPort": "1434",
					"ToPort": "1434",
					"CidrIp": "10.0.0.0/8"
			    }],
				"Tags": [{"Key": "Name",	"Value": "sg/vpc_sysco_nonprod_02/cp_db_dev"}]
			}
		},
		"IngressAdder6":{
			"DependsOn": "DevDBSG",
			"Type": "AWS::EC2::SecurityGroupIngress",
			"Properties":
			{
			    "FromPort" : "-1",
				"GroupId" : {"Ref":"DevDBSG"},
				"IpProtocol" : "-1",
				"SourceSecurityGroupId" : {"Ref":"DevDBSG"},
				"ToPort" : "-1"
			}
		},

		"MS238CPAC01d": {
			"Type" : "AWS::EC2::Instance",
			"Properties" : {
				"AvailabilityZone" : "us-east-1c",
				"DisableApiTermination" : "true",
				"ImageId" : "ami-385fe350",
				"InstanceType" : "m1.small",
				"KeyName" : {"Ref" : "DevPemKey"},
				"PrivateIpAddress" : "10.168.128.135",
				"SecurityGroupIds" : [{ "Ref" : "DevDBSG" }, {"Ref" : "CheckMKClient" }],
				"SubnetId" : { "Ref" : "DevSubnet1E1C" },
				"Tags" : [ 
				    { "Key" : "Name", "Value": "MS238CPAC01d" },
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

		"MS238CPBTSQL06d": {
			"Type" : "AWS::EC2::Instance",
			"Properties" : {
				"AvailabilityZone" : "us-east-1c",
				"DisableApiTermination" : "true",
				"ImageId" : "ami-5c2dbc34",
				"InstanceType" : "m3.large",
				"KeyName" : {"Ref" : "DevPemKey"},
				"PrivateIpAddress" : "10.168.128.146",
				"SecurityGroupIds" : [{ "Ref" : "DevDBSG" }, {"Ref" : "CheckMKClient" }],
				"SubnetId" : { "Ref" : "DevSubnet1E1C" },
				"Tags" : [ 
				    { "Key" : "Name", "Value": "MS238CPBTSQL06d" },
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
		},
		"MS238CPBTSQL07d": {
			"Type" : "AWS::EC2::Instance",
			"Properties" : {
				"AvailabilityZone" : "us-east-1c",
				"DisableApiTermination" : "true",
				"ImageId" : "ami-5c2dbc34",
				"InstanceType" : "m3.large",
				"KeyName" : {"Ref" : "DevPemKey"},
				"PrivateIpAddress" : "10.168.128.148",
				"SecurityGroupIds" : [{ "Ref" : "DevDBSG" }, {"Ref" : "CheckMKClient" }],
				"SubnetId" : { "Ref" : "DevSubnet1E1C" },
				"Tags" : [ 
				    { "Key" : "Name", "Value": "MS238CPBTSQL07d" },
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
		},

		"MS238CPODSQL06d": {
			"Type" : "AWS::EC2::Instance",
			"Properties" : {
				"AvailabilityZone" : "us-east-1c",
				"DisableApiTermination" : "true",
				"ImageId" : "ami-5c2dbc34",
				"InstanceType" : "m3.large",
				"KeyName" : {"Ref" : "DevPemKey"},
				"PrivateIpAddress" : "10.168.128.144",
				"SecurityGroupIds" : [{ "Ref" : "DevDBSG" }, {"Ref" : "CheckMKClient" }],
				"SubnetId" : { "Ref" : "DevSubnet1E1C" },
				"Tags" : [ 
				    { "Key" : "Name", "Value": "MS238CPODSQL06d" },
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
		},
		"MS238CPODSQL07d": {
			"Type" : "AWS::EC2::Instance",
			"Properties" : {
				"AvailabilityZone" : "us-east-1c",
				"DisableApiTermination" : "true",
				"ImageId" : "ami-5c2dbc34",
				"InstanceType" : "m3.large",
				"KeyName" : {"Ref" : "DevPemKey"},
				"PrivateIpAddress" : "10.168.128.145",
				"SecurityGroupIds" : [{ "Ref" : "DevDBSG" }, {"Ref" : "CheckMKClient" }],
				"SubnetId" : { "Ref" : "DevSubnet1E1C" },
				"Tags" : [ 
				    { "Key" : "Name", "Value": "MS238CPODSQL07d" },
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
