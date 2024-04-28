import './App.css';
import { Menu } from "antd";
import { Route,Routes,useNavigate} from 'react-router-dom';
import {
  HomeOutlined,
  ProfileOutlined,
  UserOutlined,
  GroupOutlined,
  PictureOutlined
} from "@ant-design/icons/lib/icons";
import { Avatar } from 'antd';
import { Form, Input} from 'antd';
import React, { useState, useEffect } from 'react';
import { Layout, Typography, Divider, Row, Button, Select,Space } from 'antd';
import { UploadOutlined, DownloadOutlined, LogoutOutlined } from '@ant-design/icons';
import { Upload, message, Table } from 'antd';
import axios from 'axios';
import Cookies from 'js-cookie';




const { Option } = Select;
const { Content: CustomContent } = Layout;
const { Content: CustomContent1 } = Layout;
const { Content: AntdContent } = Layout;
const { Title, Paragraph } = Typography;



function App(){
  const navigate = useNavigate();
  
  
  return ( 
    <div style={{display:'flex',flexDirection:'column', flex:1,height:'100vh'}}>
      <CustomHeader />
      <div style={{display:'flex',flexDirection:'row', flex:1}}>
        <SideMenu />
        <Content />
      </div>
      <CustomFooter />
    </div>
      
  );
}

function CustomHeader(){
  return (
    <div
      style={{
        width: '100%', // Set the width to 100% to span the entire screen
        height: '100px',
        backgroundColor: '#89CFF0', // Blue color theme
        backgroundImage: "url('./header1.jpg')",
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        color: 'white',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between', // Align items to start and end for better spacing
        alignItems: 'center',
        fontFamily: 'Arial, sans-serif',
        fontWeight: 'bold',
        padding: '0 30px', // padding for better spacing
        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)', // subtle shadow
      
      }}
    >
      <div>
        <Title style={{ 
          color: 'white', 
          margin: 0,
          fontSize: '70px',
          fontWeight: 600,
          backgroundImage: 'linear-gradient(to left, #5072A7, #13274F)',
          color: 'transparent',
          WebkitBackgroundClip: 'text',
          backgroundClip: 'text',
          //textShadow: '0px 2px 5px rgba(0, 0, 255, 0.6)'
          
          }} 
          level={3}>
          CLEANSENTRY
        </Title>
      </div>
    </div>
  );
}

function CustomFooter(){
  return <div 
            style={{
              height: '20px',
              backgroundColor: '#89CFF0', // Blue color theme
              color: 'white',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              fontWeight: 'bold',
              borderTop: '1px solid #e8e8e8', // border at the top
            }}
              >
              CLEANSENTRY ©2024 </div>
}

function SideMenu(){
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  
  useEffect(() => {
    let user = Cookies.get('CLEANSENTRY_USER');
    if(user){
      setIsLoggedIn(true)
    }else{
      setIsLoggedIn(false)
    }
  });
  
  return (<div style={{display:'flex',flexDirection:'row'}}>
  <Menu 
  
  onClick={({key})=>{
    if(key ==="signout"){
      Cookies.remove('CLEANSENTRY_USER');
      navigate('droneOperatorPage')
    }else{
      navigate(key);
    }

  }}
  selectedKeys={[window.location.pathname]}
    items={[
      { label:"Home",key:"/home",icon:<HomeOutlined /> },
      { label:"About",key:"/about", icon:<ProfileOutlined /> },
      !isLoggedIn && { label:"Drone Operator Login",key:"/droneOperatorPage", icon:<UserOutlined /> },
      isLoggedIn && { label:"Upload images",key:"/imageUpload", icon:<PictureOutlined />},
      { label:"Recycling Process Details",key:"/recyclingProcess", icon:<GroupOutlined /> },
      isLoggedIn && { label:"Sign Out",key:"signout", icon: <LogoutOutlined style={{ color: 'red' }}/>}

      
    ]}  
  ></Menu>
  </div>)
}

function Home(){
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [reportLocation, setReportLocation] = useState(null);
  const [reportData, setReportData] = useState(null);
  const [recyclingCenters, setRecyclingCenters] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const handleLocationChange = (value) => {
    setSelectedLocation(value);
  };




  const handleGenerateReport = () => {
    
    if (selectedLocation) {
      // Perform action to generate report
      console.log(`Generating report for location: ${selectedLocation}`);
      setReportData([]);
      setReportLocation(selectedLocation)
      const fetchData = async () => {
        try {
          const response = await axios.get(`/prediction/${selectedLocation}`);
          setReportData(response.data['predictions']);
          const rc_response = await axios.get(`/recycling_centers/${selectedLocation}`);
          setRecyclingCenters(rc_response.data['centers'])
        } catch (error) {
          setError(error);
          setRecyclingCenters([])
          setReportData([]);
        } finally {
          setLoading(false);
        }
      };

      fetchData();

      // Mock report data (replace with actual data retrieval)
      const report = reportData;

      setReportData(report);
    } else {
      // Display error message or prompt user to select a location
      console.log('Please select a location before generating the report');
    }
  };

  const columns = [
    {
      title: 'City',
      dataIndex: 'location',
      key: 'location',
    },
    {
      title: 'Date',
      dataIndex: 'date',
      key: 'date',
    },
    {
      title: 'Plastic waste percentage',
      dataIndex: 'plastic_percentage',
      key: 'plastic_percentage',
    },
    {
      title: 'Metal waste percentage',
      dataIndex: 'metal_percentage',
      key: 'metal_percentage',
    },
    {
      title: 'Glass waste percentage',
      dataIndex: 'glass_percentage',
      key: 'glass_percentage',
    },
    {
      title: 'Foam waste percentage',
      dataIndex: 'foam_percentage',
      key: 'foam_percentage',
    },
  ];

  const centers = [
    {
      title: 'Contact Person',
      dataIndex: 'contact_person',
      key: 'contact_person',
    },
    {
      title: 'Company Name',
      dataIndex: 'company_name',
      key: 'company_name',
    },
    {
      title: 'Address',
      dataIndex: 'address',
      key: 'address',
    },
    {
      title: 'Telephone Number',
      dataIndex: 'telephone_number',
      key: 'telephone_number',
    },
    {
      title: 'Nature of Business',
      dataIndex: 'nature_of_business',
      key: 'nature_of_business',
    },
    {
      title: 'Nature of Materials',
      dataIndex: 'nature_of_materials',
      key: 'nature_of_materials',
    },
  ];

  return (
    <div style={{ padding: '50px' }}>
      <Title level={2} style={{ marginBottom: '30px' }}>Welcome to CLEANSENTRY Application!</Title>
      <Title level={3}>Waste Classification Report Generation</Title>
      <Divider />
      <Paragraph>
        <Title level={5}>Select Location</Title>
        <Select
          style={{ width: '100%', marginBottom: '20px' }}
          placeholder="Select location"
          onChange={handleLocationChange}
        >
          <Option value="Dehiwala">Dehiwala</Option>
          <Option value="Mount Lavinia">Mount Lavinia</Option>
          <Option value="Moratuwa">Moratuwa</Option>
          <Option value="Wellawatte">Wellawatte</Option>
          <Option value="Bambalapitiya">Bambalapitiya</Option>
          <Option value="Kollupitiya">Kollupitiya</Option>
        </Select>
        <Button
          type="primary"
          icon={<DownloadOutlined />}
          onClick={handleGenerateReport}
        >
          Generate Report
        </Button>
      </Paragraph>
      <Divider />
      {reportData && (
        <div>
          <Title level={4}>Report for {reportLocation}</Title>
          <Table dataSource={reportData} columns={columns} />

          <Title level={4}>Report for {reportLocation} Recycling Centers</Title>
          <Table dataSource={recyclingCenters} columns={centers} />
        </div>
      )}
    </div>
  );
}

function About(){
  return(
    <Layout>
        {/* <Header style={{ backgroundColor: '#001529', padding: '0 50px' }}>
            <div className="logo" style={{ float: 'left' }}>
                <Title level={3} style={{ color: '#fff', margin: 0 }}>CLEANSENTRY Application</Title>
            </div>
        </Header> */}
        <AntdContent  style={{ padding: '30px' }}>
            <div style={{ background: '#fff', padding: 24, minHeight: 280 }}>
                <Title level={2} style={{ marginBottom: '20px' }}>About CLEANSENTRY</Title>
                <Divider />
                <Paragraph>
                    <Title level={4}>Why Beach Waste Classification and Recycling is Important?</Title>
                    <Paragraph>
                        Beaches are beautiful natural environments that provide us with recreational opportunities, wildlife habitats, and stunning scenery. However, they are also susceptible to pollution from various sources, including litter and waste. Beach waste, especially plastic waste, poses significant threats to marine life, ecosystems, and human health.
                    </Paragraph>
                    <Paragraph>
                        Beach waste classification and recycling play crucial roles in preserving our beaches and marine environments. By accurately classifying beach waste, we can identify the sources of pollution and take targeted actions to mitigate its impact. Recycling allows us to reduce the amount of waste that ends up in our oceans and landfills, conserving resources and protecting the environment.
                    </Paragraph>
                </Paragraph>
                <Divider />
                <Paragraph>
                    <Title level={4}>About Our Application</Title>
                    <Paragraph>
                        Our application utilizes drone images and machine learning technology to classify beach waste, helping to monitor and manage waste pollution along coastal areas in Western Province Sri Lanka. With the power of artificial intelligence, we aim to streamline the process of identifying and categorizing waste types, contributing to environmental conservation efforts.
                    </Paragraph>
                </Paragraph>
                <Divider />
                <Paragraph>
                    <Title level={4}>How It Works</Title>
                    <ol>
                        <li> <b>Drone Image Upload:</b> Drone operators upload images of beaches, specifying location and date details.</li>
                        <li> <b>Image Classification:</b> Our machine learning model analyzes the drone images to detect and classify waste types such as glass, metal, plastic, and foam. The system counts the number of waste items identified for each class and stores the data based on the location.</li>
                        <li> <b>Report Generation:</b> End users log in to the application and select a location to request a waste classification report. The report includes the number of waste items identified for each waste type and provides details of the nearest recycling centers.</li>
                    </ol>
                </Paragraph>
                <Divider />
                <Paragraph>
                    <Title level={4}>Key Features</Title>
                    <ul>
                        <li><b>Drone Image Classification:</b> Our AI-driven model accurately classifies beach waste, providing valuable insights for waste management strategies.</li>
                        <li><b>Location-Based Reporting:</b> Users can access waste classification reports tailored to specific beach locations, facilitating targeted cleanup and conservation efforts.</li>
                        <li><b>Recycling Center Information:</b> Our application includes a database of recycling centers, enabling users to locate nearby facilities for proper waste disposal and recycling.</li>
                    </ul>
                </Paragraph>
                <Divider />
                <Paragraph>
                    <Title level={4}>Get Involved</Title>
                    <Paragraph>
                        Join us in our mission to protect our beaches and oceans! Whether you're an environmental enthusiast or a concerned citizen, your involvement makes a difference. Help us raise awareness and drive positive change for a cleaner, healthier coastline.
                    </Paragraph>
                </Paragraph>
                <Divider />
                <Paragraph>
                    <Title level={4}>Contact Us</Title>
                    <Paragraph>
                        Have questions or feedback? We're here to help! Contact our team at <a href="mailto:cleansentry@gmail.com">cleansentry@gmail.com</a> to learn more about our application and how you can contribute to our cause.
                    </Paragraph>
                </Paragraph>
            </div>
        </AntdContent >
        
    </Layout>
);
}

function DroneOperatorLogin() {
  const navigate = useNavigate();
 
  let users =[
    {
        "username": "admin",
        "password": "admin"
    },
    {
        "username": "test",
        "password": "test"
    },
    {
        "username": "test1",
        "password": "test1"
    }
]
  

  const onFinish = ({username,password}) => {
    
    const isUser = (username, password) => {
      console.log(users)
      return users.map(user => user.username==username && user.password == password).includes(true);
    };

    if(isUser(username, password)){
      Cookies.set('CLEANSENTRY_USER', username);
      navigate('/imageUpload');
    }else{
      message.error('Login failed. Please check your credentials.');
    }
  };

  const onFinishFailed = (errorInfo) => {
    Cookies.remove('CLEANSENTRY_USER');
  };

  return (
    <div style={{ padding: '50px' }}>
      <Title level={2} style={{ marginBottom: '20px' }}>Drone Operator Login</Title>
      <Form
        name="basic"
        initialValues={{ remember: true }}
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
      >
        <Form.Item
          label="Username"
          name="username"
          rules={[{ required: true, message: 'Please input your username!' }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Password"
          name="password"
          rules={[{ required: true, message: 'Please input your password!' }]}
        >
          <Input.Password />
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit">
            Login
          </Button>
          
        </Form.Item>
      </Form>
    </div>
  );
};


function RecyclingProcess() {
  return (
    <Layout>
      <CustomContent1 style={{ padding: '30px' }}>
        <div style={{ background: '#fff', padding: 24, minHeight: 280 }}>
          <Title level={2} style={{ marginBottom: '20px' }}>Recycling Process in Sri Lanka</Title>
          <Divider />
          <Paragraph>
            <Title level={4}>Overview</Title>
            <Paragraph>
              Recycling plays a crucial role in Sri Lanka's waste management efforts, especially in combating beach waste pollution. The recycling process aims to reclaim valuable resources from materials like plastic, rigid foam, glass, and metal, commonly found on our beaches and coastal areas.
            </Paragraph>
          </Paragraph>
          <Divider />

          <Paragraph>
            <Title level={4}>Collection</Title>
            <Paragraph>
              <ul>
                <li>Community Recycling Centers: Many communities have established recycling centers where residents can drop off recyclable materials for collection and processing.</li>
                <li>Municipal Collection Services: Municipalities provide collection services for recyclable materials, which are then transported to recycling facilities for further processing.</li>
              </ul>
            </Paragraph>
          </Paragraph>
          <Divider />

          <Paragraph>
            <Title level={4}>Processing</Title>
            <Paragraph>
              <ul>
                <li>Sorting: Recyclable materials undergo sorting at recycling facilities to separate different types of materials.</li>
                <li>Cleaning: Sorted materials are cleaned to remove contaminants like dirt, labels, and other impurities.</li>
                <li>Shredding or Melting: Depending on the material type, items may be shredded into smaller pieces or melted down to form raw materials for manufacturing new products.</li>
                <li>Baling: Processed materials are compacted into bales for easier transportation and storage.</li>
              </ul>
            </Paragraph>
          </Paragraph>
          <Divider />

          <Paragraph>
            <Title level={4}>Recycling Industries</Title>
            <Paragraph>
              <ul>
                <li>Plastic Recycling: Collected plastic materials undergo various processes such as shredding, washing, and melting to transform them into raw materials for creating new plastic products.</li>
                <li>Glass Recycling: Glass fragments collected from beaches are melted down and reshaped into new glass products like bottles and containers.</li>
                <li>Metal Recycling: Metal cans and containers are melted and repurposed to manufacture new metal products or components.</li>
                <li>Rigid Foam Recycling: Rigid foam materials are processed and repurposed into various products or utilized as insulation materials.</li>
              </ul>
            </Paragraph>
          </Paragraph>
          <Divider />

          <Paragraph>
            <Title level={4}>Special Recycling Initiatives in Sri Lanka</Title>
            <Paragraph>
              <ul>
                <li>
                  <Title level={5}>Trash to Cash:</Title>
                  <Paragraph>An innovative machine accepts empty plastic bottles from consumers and rewards them with incentives that can be redeemed at selected outlets. Users simply insert their bottles, receive an SMS with redemption details, and redeem their rewards at the cashier.</Paragraph>
                  <Paragraph>
                    <Title level={5}>How it works:</Title>
                    <ol>
                      <li>Press 'Start' on the machine.</li>
                      <li>Insert one bottle at a time with the barcode facing up.</li>
                      <li>Enter your phone number to receive an SMS with redemption details.</li>
                      <li>Redeem your incentives at the cashier using the provided information.</li>
                    </ol>
                  </Paragraph>
                </li>
                <li>
                  <Title level={5}>Katana Upcycle:</Title>
                  <Paragraph>A community-driven initiative in Katana, led by a recycler named Jayantha, focuses on upcycling industrial waste materials such as plastics, fabrics, and paper. Jayantha collects, segregates, and processes these materials to create plastic pellets, which are then used to craft upcycled products like books, file covers, and purses.</Paragraph>
                  <Paragraph>
                    <Title level={5}>Products:</Title>
                    <ul>
                      <li>Upcycled items include environmentally-friendly books, file covers, and purses, made from waste materials such as wrapping papers, biscuit packaging, tetra packs, aluminum, and polythene.</li>
                    </ul>
                  </Paragraph>
                  <Paragraph>
                    <Title level={5}>Environmental Impact:</Title>
                    <ul>
                      <li>This initiative promotes locally-made, eco-friendly products, contributing to waste reduction and environmental conservation efforts.</li>
                    </ul>
                  </Paragraph>
                </li>
              </ul>
            </Paragraph>
          </Paragraph>
          <Divider />
          <Paragraph>
            These special recycling initiatives epitomize innovative solutions in waste management and environmental sustainability in Sri Lanka. By integrating these initiatives with broader recycling practices, our nation aims to combat beach waste pollution and foster a circular economy for a cleaner and healthier coastline.
          </Paragraph>
        </div>
      </CustomContent1>
    </Layout>
  );

}

function ImageUpload() {
  const [city, setCity] = useState('dehiwala');
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [progress, setProgress] = useState(0);
  const [report, setReport] = useState(null);

  const handleCityChange = (value) => {
    setCity(value);
  };

  // const handleFileUpload = (info) => {
  //   setUploadedFiles([...uploadedFiles, info.file]);
  // };

  const handleFileUpload = ({ file, fileList }) => {

    let files = fileList.map((file) => (
      file.originFileObj
    ));
    
    setUploadedFiles(files);
  };

  const handleImages = async () => {
   console.log(uploadedFiles)
   if (!uploadedFiles) {
      message.error('Please select a file.');
      return;
    }

    const formData = new FormData();
    uploadedFiles.forEach(file => {
      formData.append('images[]', file);
    });
    formData.append('city', city);

    try {
      let response = await axios.post('upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      console.log(response.data)
      message.success("Images uploaded successessfully.")
      setUploadedFiles([])
    } catch (error) {
      message.error('Error uploading files.')
      console.error('Error uploading file:', error);
    }
  };


  const columns = [
    {
      title: 'File Name',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Upload Date',
      dataIndex: 'uploadDateTime',
      key: 'uploadDateTime',
    },
  ];

  return (
    <div style={{ padding: '50px' }}>
      <Title level={2} style={{ marginBottom: '20px' }}>Drone Image Upload</Title>
      <div style={{ marginBottom: '20px' }}>
        <Select
          defaultValue="Dehiwala"
          style={{ width: 200, marginRight: '10px' }}
          onChange={handleCityChange}
        >
          <Option value="Dehiwala">Dehiwala</Option>
          <Option value="Mount Lavinia">Mount Lavinia</Option>
          <Option value="Moratuwa">Moratuwa</Option>
          <Option value="Wellawatte">Wellawatte</Option>
          <Option value="Bambalapitiya">Bambalapitiya</Option>
          <Option value="Kollupitiya">Kollupitiya</Option>
          
        </Select>
        <Upload
          fileList={uploadedFiles}
          onChange={handleFileUpload}
          multiple
          accept=".png,.jpg,.jpeg"
          showUploadList={{ showRemoveIcon: true }}
          beforeUpload={() => false} // Prevent actual file upload
        >
          <Button icon={<UploadOutlined />}>Upload Images</Button>
        </Upload>
        {/* <Progress percent={progress} style={{ marginTop: '10px' }} /> */}
      </div>
       <Space style={{ marginBottom: '20px' }}>
        <Button type="primary" onClick={handleImages}>Done</Button>
        {/* <Button type="primary" onClick={handleGenerateReport}>Generate Report</Button> */}
      </Space>
      {/*{report && (
        <div style={{ marginTop: '20px' }}>
          <h2>Cleansentry Automated Detailed Report for Garbage Classification</h2>
          <Table dataSource={report} columns={columns} />
          <Button type="primary" icon={<DownloadOutlined />} onClick={handleDownloadReport} style={{ marginTop: '20px' }}>Download Report</Button>
        </div>
      )} */}
    </div>
  );
}






function Content(){
  return <div>
    <Routes>
      <Route path="/home/*" element={<Home />}></Route>
      <Route path="/about/*" element={<About />}></Route>
      <Route path="/droneOperatorPage/*" element={<DroneOperatorLogin/>}></Route>
      <Route path="/imageUpload/*" element={<ImageUpload />}></Route>
      {/* <Route path="/droneOperatorPage/*">
        {false ? <DroneOperatorLogin /> : <Redirect to="/imageUpload" />}
      </Route> */}
      {/* <Route path="/imageUpload/*" element={<div>ImageUpload</div>}></Route> */}
      <Route path="/recyclingProcess/*" element={<RecyclingProcess/>}></Route>
    </Routes>
  </div>
}

export default App;