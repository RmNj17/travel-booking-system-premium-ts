import {
  CalendarOutlined,
  DeleteOutlined,
  EditOutlined,
  EnvironmentOutlined,
} from "@ant-design/icons";
import {
  Badge,
  Button,
  Card,
  Descriptions,
  Space,
  Tag,
  Typography,
} from "antd";
import { TravelPackage } from "../types";
import { fallbackImage, money } from "../utils/format";

const { Paragraph, Title } = Typography;

type Props = {
  pkg: TravelPackage;
  onSelect: () => void;
  onDelete?: () => void;
  isAdmin?: boolean;
};

export function PackageCard({ pkg, onSelect, onDelete, isAdmin }: Props) {
  const ribbonColor =
    pkg.availableSeats > 5 ? "blue" : pkg.availableSeats > 0 ? "orange" : "red";
  const isAdminMode = Boolean(isAdmin);
  const canBook = pkg.availableSeats > 0;

  return (
    <Badge.Ribbon text={`${pkg.availableSeats} seats left`} color={ribbonColor}>
      <Card
        hoverable
        className="packageCard"
        cover={<img src={pkg.imageUrl || fallbackImage} alt={pkg.title} />}
        bodyStyle={{ padding: 18 }}
        actions={
          isAdminMode
            ? [
                <Button
                  key="edit"
                  type="default"
                  icon={<EditOutlined />}
                  onClick={onSelect}
                >
                  Edit package
                </Button>,
                <Button
                  key="delete"
                  danger
                  type="default"
                  icon={<DeleteOutlined />}
                  onClick={onDelete}
                >
                  Delete package
                </Button>,
              ]
            : [
                <Button
                  key="book"
                  type="primary"
                  icon={<CalendarOutlined />}
                  onClick={onSelect}
                  disabled={!canBook}
                >
                  View and Book
                </Button>,
              ]
        }
      >
        <Space direction="vertical" size={6} style={{ width: "100%" }}>
          <Tag color="processing" className="destinationTag">
            <EnvironmentOutlined /> {pkg.destination}
          </Tag>
          <Title level={4} className="cardTitle">
            {pkg.title}
          </Title>
          <Paragraph ellipsis={{ rows: 2 }} className="itineraryText">
            {pkg.itinerary}
          </Paragraph>
          <Descriptions column={2} size="small" className="cardMeta">
            <Descriptions.Item label="Duration">
              {pkg.durationDays} days
            </Descriptions.Item>
            <Descriptions.Item label="Price">
              <strong>{money(pkg.price)}</strong>
            </Descriptions.Item>
          </Descriptions>

          <div className="miniAmenities">
            <div className="miniAmenityBox">
              <span className="miniAmenityLabel">Hotel</span>
              <span className="miniAmenityValue">
                {pkg.hotelDetails || "Included"}
              </span>
            </div>
            <div className="miniAmenityBox">
              <span className="miniAmenityLabel">Transport</span>
              <span className="miniAmenityValue">
                {pkg.transport || "Included"}
              </span>
            </div>
          </div>
        </Space>
      </Card>
    </Badge.Ribbon>
  );
}
