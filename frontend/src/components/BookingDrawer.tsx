import { CheckCircleOutlined, CreditCardOutlined } from "@ant-design/icons";
import {
  Button,
  DatePicker,
  Descriptions,
  Divider,
  Drawer,
  Empty,
  Form,
  Input,
  InputNumber,
  Radio,
  Space,
  Typography,
} from "antd";
import dayjs from "dayjs";
import { Session, TravelPackage } from "../types";
import { fallbackImage, money } from "../utils/format";

const { Paragraph, Text, Title } = Typography;

type BookingValues = {
  travelDate: dayjs.Dayjs;
  fullName: string;
  age: number;
  passportNo: string;
  nationality: string;
  paymentSimulation: "SUCCESS" | "FAILED";
};

type Props = {
  open: boolean;
  pkg: TravelPackage | null;
  session: Session | null;
  submitting: boolean;
  onClose: () => void;
  onSubmit: (values: BookingValues) => void;
};

export function BookingDrawer({
  open,
  pkg,
  session,
  submitting,
  onClose,
  onSubmit,
}: Props) {
  return (
    <Drawer
      title="Confirm Travel Package Booking"
      open={open}
      onClose={onClose}
      width={560}
      destroyOnClose
    >
      {!pkg ? null : (
        <>
          <img
            className="drawerImage"
            src={pkg.imageUrl || fallbackImage}
            alt={pkg.title}
          />
          <Title level={3}>{pkg.title}</Title>
          <Paragraph>{pkg.itinerary}</Paragraph>
          <Descriptions bordered size="small" column={1}>
            <Descriptions.Item label="Destination">
              {pkg.destination}
            </Descriptions.Item>
            <Descriptions.Item label="Duration">
              {pkg.durationDays} days
            </Descriptions.Item>
            <Descriptions.Item label="Available Seats">
              {pkg.availableSeats}
            </Descriptions.Item>
            <Descriptions.Item label="Total Amount">
              <Text strong>{money(pkg.price)}</Text>
            </Descriptions.Item>
          </Descriptions>

          <div className="bookingHighlights">
            <div className="bookingHighlightCard">
              <Text strong>Hotel</Text>
              <span className="bookingHighlightText">
                {pkg.hotelDetails || "Included"}
              </span>
            </div>
            <div className="bookingHighlightCard">
              <Text strong>Transport</Text>
              <span className="bookingHighlightText">
                {pkg.transport || "Included"}
              </span>
            </div>
          </div>
          <Divider />

          {!session ? (
            <Empty description="Please login before booking a package." />
          ) : (
            <Form
              layout="vertical"
              onFinish={onSubmit}
              initialValues={{
                nationality: "Nepalese",
                travelDate: dayjs().add(7, "day"),
                paymentSimulation: "SUCCESS",
              }}
            >
              <Form.Item
                name="travelDate"
                label="Travel Date"
                rules={[
                  { required: true, message: "Travel date is required." },
                ]}
              >
                <DatePicker
                  size="large"
                  style={{ width: "100%" }}
                  disabledDate={(date) => date.isBefore(dayjs().startOf("day"))}
                />
              </Form.Item>
              <Form.Item
                name="fullName"
                label="Traveller Full Name"
                rules={[
                  {
                    required: true,
                    message: "Traveller full name is required.",
                  },
                ]}
              >
                <Input size="large" placeholder="Enter traveller name" />
              </Form.Item>
              <Space.Compact block>
                <Form.Item
                  name="age"
                  label="Age"
                  rules={[
                    { required: true, message: "Age is required." },
                    {
                      type: "number",
                      min: 1,
                      message: "Age must be at least 1.",
                    },
                    {
                      type: "number",
                      max: 120,
                      message: "Age must be 120 or less.",
                    },
                  ]}
                  style={{ width: "35%" }}
                >
                  <InputNumber
                    size="large"
                    min={1}
                    max={120}
                    style={{ width: "100%" }}
                  />
                </Form.Item>
                <Form.Item
                  name="nationality"
                  label="Nationality"
                  rules={[
                    { required: true, message: "Nationality is required." },
                  ]}
                  style={{ width: "65%" }}
                >
                  <Input size="large" />
                </Form.Item>
              </Space.Compact>
              <Form.Item
                name="passportNo"
                label="Passport Number"
                rules={[
                  { required: true, message: "Passport number is required." },
                ]}
              >
                <Input
                  size="large"
                  placeholder="Passport / travel document number"
                />
              </Form.Item>
              <Form.Item name="paymentSimulation" label="Payment Simulation">
                <Radio.Group buttonStyle="solid">
                  <Radio.Button value="SUCCESS">
                    <CreditCardOutlined /> Success
                  </Radio.Button>
                  <Radio.Button value="FAILED">Failed</Radio.Button>
                </Radio.Group>
              </Form.Item>
              <Button
                loading={submitting}
                type="primary"
                htmlType="submit"
                icon={<CheckCircleOutlined />}
                size="large"
                block
              >
                Confirm Booking and Process Payment
              </Button>
            </Form>
          )}
        </>
      )}
    </Drawer>
  );
}
