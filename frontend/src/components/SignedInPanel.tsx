import { CheckCircleOutlined, ShoppingCartOutlined, UserOutlined } from '@ant-design/icons';
import { Avatar, Col, Divider, Row, Space, Statistic, Typography } from 'antd';
import { Session } from '../types';
import { money } from '../utils/format';

const { Text, Title } = Typography;

type Props = {
  session: Session;
  bookingsCount: number;
  confirmedCount: number;
  revenue: number;
};

export function SignedInPanel({ session, bookingsCount, confirmedCount, revenue }: Props) {
  return (
    <div>
      <Space align="center">
        <Avatar size={56} icon={<UserOutlined />} />
        <div>
          <Text type="secondary">Signed in as</Text>
          <Title level={4} style={{ margin: 0 }}>{session.user.fullName}</Title>
          <Text type="secondary">{session.user.email}</Text>
        </div>
      </Space>
      <Divider />
      <Row gutter={[12, 12]}>
        <Col span={8}><Statistic title="Bookings" value={bookingsCount} prefix={<ShoppingCartOutlined />} /></Col>
        <Col span={8}><Statistic title="Confirmed" value={confirmedCount} prefix={<CheckCircleOutlined />} /></Col>
        <Col span={8}><Statistic title="Amount" value={money(revenue)} /></Col>
      </Row>
    </div>
  );
}
