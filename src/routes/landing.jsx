import React from 'react';
import { Layout, Space, Select, Row, Col } from 'antd';
import { ChevronDown } from 'lucide-react';

const { Header, Footer, Content } = Layout;

const headerStyle = {
  backgroundColor: 'var(--white)',
  display: 'flex',
  // height: 80,
};

const welcomeBlockStyle = {
  backgroundImage: 'url(/public/bg-landing-main.jpg)',
  minHeight: 'calc(100vh - 115px)',
  marginTop: '115px',
  backgroundSize: 'cover',
  backgroundPosition: 'center',
};

const headerBigTextStyle = {
  fontSize: '4rem',
};
const headerSmallTextStyle = {
  letterSpacing: '1.1px',
};

const siteTitleStyle = {
  color: 'var(--black)',
};

const headerSubtextStyle = {
  maxWidth: 760,
};

const links = [
  {
    text: 'energy ai',
    url: '/',
  },
  {
    text: 'indicators',
    url: '/',
  },
  {
    text: 'profiles',
    url: '/',
  },
  {
    text: 'resources',
    url: '/',
  },
];

const pages = [
  {
    name: 'ENERGY AI',
    description:
      'An AI tool to interact with energy reports, policies, and plans',
    url: '',
  },
  {
    name: 'Country Profiles',
    description: 'Energy profiles and policies with automated reports',
    url: '',
  },
  {
    name: 'Energy Indicators',
    description:
      'Interactive visualizations on country-level energy indicators ',
    url: '',
  },
  {
    name: 'Geospatial Data',
    description: 'Mapping energy access and renewable energy potential',
    url: '',
  },
  {
    name: 'UNDP Portfolio',
    description: 'Analytics on the UNDP Energy Portfolio',
    url: '',
  },
  {
    name: 'Resources and About',
    description: 'Access publications, databases, and other resources',
    url: '',
  },
];

export default function Landing() {
  return (
    <Space direction='vertical' style={{ width: '100%' }} size={[0, 48]}>
      <Layout>
        <Header
          className='flex-space-between undp-country-header'
          style={headerStyle}
        >
          <a className='flex-div' href='/'>
            <img src='/public/undp-logo-blue.svg' alt='UNDP logo' />
          </a>
          <div className='margin-left-05 flex-div flex-vert-align-center'>
            <a style={siteTitleStyle} href='/'>
              <p className='undp-site-title'>Sustainable Energy</p>
              <p className='undp-site-title'>Knowledge Platform</p>
            </a>
          </div>
          <div className='margin-right-auto margin-left-auto undp-nav-div'>
            {links.map((menuItem, i) => (
              <a key={i} href={menuItem.url}>
                {menuItem.text}
              </a>
            ))}
          </div>
          <div className='margin-left-auto undp-language-select d-flex flex-vert-align-center flex-hor-align-center'>
            <Select
              defaultValue='en'
              options={[{ value: 'en', label: 'English' }]}
              bordered={false}
              suffixIcon={null}
            />
          </div>
        </Header>
        <Content>
          <div className='flex-column d-flex' style={welcomeBlockStyle}>
            <div className='margin-top-auto margin-bottom-auto'>
              <h2
                style={headerSmallTextStyle}
                className='undp-typography page-title text-center text-white text-uppercase margin-bottom-00'
              >
                UNDP Sustainable Energy HUB
              </h2>
              <h1
                style={headerBigTextStyle}
                className='undp-typography text-center text-white text-uppercase margin-top-00'
              >
                KNOWLEDGE Platform
              </h1>
              <p
                style={headerSubtextStyle}
                className='undp-typography text-white text-center margin-left-auto margin-right-auto'
              >
                Nam libero tempore, cum soluta nobis est eligendi optio cumque
                nihil impedit quo minus id quod maxime placeat facere possimus.
              </p>
            </div>
            <a
              href='#content'
              className='text-white text-center margin-left-auto margin-right-auto margin-bottom-08'
            >
              <ChevronDown size={64} />
            </a>
          </div>
          <section className='undp-container margin-top-11 flex-column d-flex'>
            <div
              className='margin-left-auto margin-right-auto'
              style={headerSubtextStyle}
            >
              <h2 className='undp-typography text-uppercase'>
                THE Sustainable ENERGY KNOWLEDGE Platform
              </h2>
              <p className='undp-typography'>
                Nam libero tempore, cum soluta nobis est eligendi optio cumque
                nihil impedit quo minus id quod maxime placeat facere possimus.
              </p>
            </div>
            <Row className='d-flex flex-hor-align-center'>
              {pages.map((pageItem, i) => (
                <Col span={20} key={i}>
                  <a className='col-18 d-flex' key={i} href={pageItem.url}>
                    <div className='bigNumber'>{`0${1 + i}`}</div>
                    <div>
                      <p>{pageItem.name}</p>
                      <p>{pageItem.description}</p>
                    </div>
                    <div
                      style={{ backgroundImage: `landing_pages_${1 + i}` }}
                    />
                  </a>
                </Col>
              ))}
            </Row>
          </section>
        </Content>
        <Footer>Footer</Footer>
      </Layout>
    </Space>
  );
}
