import { PlusOutlined } from "@ant-design/icons";
import { Button, Col, Form, Input, InputNumber, Row, Space } from "antd";
import { useEffect } from "react";
import { CreatePackagePayload } from "../types";

type Props = {
  loading: boolean;
  onSubmit: (values: CreatePackagePayload) => void;
  onCancelEdit: () => void;
  initialValues?: CreatePackagePayload;
  submitLabel?: string;
};

export function AdminPanel({
  loading,
  onSubmit,
  onCancelEdit,
  initialValues,
  submitLabel,
}: Props) {
  const [form] = Form.useForm<CreatePackagePayload>();

  useEffect(() => {
    if (initialValues) {
      form.setFieldsValue(initialValues);
    } else {
      form.resetFields();
    }
  }, [initialValues, form]);

  function handleFinish(values: CreatePackagePayload) {
    onSubmit(values);
    if (!initialValues) {
      form.resetFields();
    }
  }

  return (
    <Space direction="vertical" size="large" style={{ width: "100%" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: 16,
          alignItems: "center",
        }}
      >
        <div>
          <h3 style={{ margin: 0, fontSize: 22 }}>
            {initialValues
              ? "Edit this travel package"
              : "Create a package travelers can book"}
          </h3>
          <p
            style={{
              margin: "6px 0 0",
              color: "rgba(0,0,0,0.68)",
              lineHeight: 1.5,
            }}
          >
            {initialValues
              ? "Update the details below to keep the package accurate and inviting."
              : "Fill in the essentials so travelers immediately understand where they are going, what is included, and how much it costs."}
          </p>
        </div>
        {initialValues && <Button onClick={onCancelEdit}>Cancel edit</Button>}
      </div>

      <Form form={form} layout="vertical" onFinish={handleFinish}>
        <Row gutter={16}>
          <Col xs={24} md={12}>
            <Form.Item
              name="title"
              label="Package Name"
              rules={[
                { required: true, message: "Package title is required." },
              ]}
            >
              <Input size="large" placeholder="Bali Family Escape" />
            </Form.Item>
          </Col>
          <Col xs={24} md={12}>
            <Form.Item
              name="destination"
              label="Destination"
              extra="Where the trip takes travelers."
              rules={[{ required: true, message: "Destination is required." }]}
            >
              <Input size="large" placeholder="Bali, Indonesia" />
            </Form.Item>
          </Col>
          <Col xs={24} md={8}>
            <Form.Item
              name="durationDays"
              label="Trip Length (Days)"
              extra="How many days the experience lasts."
              rules={[{ required: true, message: "Duration is required." }]}
            >
              <InputNumber size="large" min={1} style={{ width: "100%" }} />
            </Form.Item>
          </Col>
          <Col xs={24} md={8}>
            <Form.Item
              name="price"
              label="Price (AUD)"
              extra="Price per traveler."
              rules={[{ required: true, message: "Price is required." }]}
            >
              <InputNumber size="large" min={1} style={{ width: "100%" }} />
            </Form.Item>
          </Col>
          <Col xs={24} md={8}>
            <Form.Item
              name="availableSeats"
              label="Available Seats"
              extra="How many spots are open for booking."
              rules={[
                { required: true, message: "Available seats are required." },
              ]}
            >
              <InputNumber size="large" min={0} style={{ width: "100%" }} />
            </Form.Item>
          </Col>
          <Col xs={24} md={12}>
            <Form.Item
              name="hotelDetails"
              label="Hotel Details"
              extra="Mention the stay quality, meals, or amenities included."
            >
              <Input size="large" placeholder="4-star hotel with breakfast" />
            </Form.Item>
          </Col>
          <Col xs={24} md={12}>
            <Form.Item
              name="transport"
              label="Transport"
              extra="List any airport pickup, coach, or local transfers."
            >
              <Input size="large" placeholder="Airport transfer and coach" />
            </Form.Item>
          </Col>
          <Col span={24}>
            <Form.Item
              name="imageUrl"
              label="Image URL"
              extra="A cover photo helps travelers preview the package."
            >
              <Input
                size="large"
                placeholder="https://images.unsplash.com/..."
              />
            </Form.Item>
          </Col>
          <Col span={24}>
            <Form.Item
              name="itinerary"
              label="Itinerary"
              extra="Describe the day-by-day experience travelers will enjoy."
              rules={[{ required: true, message: "Itinerary is required." }]}
            >
              <Input.TextArea
                rows={4}
                placeholder="Day 1 arrival, Day 2 sightseeing..."
              />
            </Form.Item>
          </Col>
        </Row>
        <Button
          loading={loading}
          type="primary"
          htmlType="submit"
          icon={<PlusOutlined />}
          size="large"
        >
          {submitLabel || "Publish Package"}
        </Button>
      </Form>
    </Space>
  );
}
