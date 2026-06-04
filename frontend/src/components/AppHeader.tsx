import { LogoutOutlined, SendOutlined, UserOutlined } from "@ant-design/icons";
import { Avatar, Button, Space, Tag, Typography } from "antd";
import { Session } from "../types";

const { Text } = Typography;

type Props = {
  session: Session | null;
  onLogout: () => void;
};

export function AppHeader({ session, onLogout }: Props) {
  return (
    <header className="siteHeader">
      <div className="brandBlock">
        <div className="brandMark">
          <SendOutlined />
        </div>
        <div>
          <Text className="brandTitle">TravelMate</Text>
          <Text className="brandSub">Online Travel Package Booking System</Text>
        </div>
      </div>

      {session ? (
        <Space size="middle" className="desktopActions">
          <Tag color={session.user.role === "ADMIN" ? "geekblue" : "blue"}>
            {session.user.role}
          </Tag>
          <Avatar icon={<UserOutlined />} />
          <Text strong>{session.user.fullName}</Text>
          <Button icon={<LogoutOutlined />} onClick={onLogout}>
            Logout
          </Button>
        </Space>
      ) : (
        ""
      )}
    </header>
  );
}
