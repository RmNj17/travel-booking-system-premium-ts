import { LockOutlined, LoginOutlined, UserOutlined } from "@ant-design/icons";
import { Button, Form, Input, Tabs } from "antd";

type LoginValues = {
  email: string;
  password: string;
};

type RegisterValues = {
  fullName: string;
  email: string;
  password: string;
};

type Props = {
  onLogin: (values: LoginValues) => void;
  onRegister: (values: RegisterValues) => void;
  loading: boolean;
};

export function AuthPanel({ onLogin, onRegister, loading }: Props) {
  return (
    <Tabs
      defaultActiveKey="login"
      items={[
        {
          key: "login",
          label: "Login",
          children: (
            <Form layout="vertical" onFinish={onLogin}>
              <Form.Item
                name="email"
                label="Email Address"
                rules={[
                  { required: true, message: "Email address is required." },
                  {
                    type: "email",
                    message: "Please enter a valid email address.",
                  },
                ]}
              >
                <Input
                  size="large"
                  prefix={<UserOutlined />}
                  placeholder="Enter your email address"
                  autoComplete="email"
                />
              </Form.Item>

              <Form.Item
                name="password"
                label="Password"
                rules={[{ required: true, message: "Password is required." }]}
              >
                <Input.Password
                  size="large"
                  prefix={<LockOutlined />}
                  placeholder="Enter your password"
                  autoComplete="current-password"
                />
              </Form.Item>

              <Button
                loading={loading}
                type="primary"
                htmlType="submit"
                icon={<LoginOutlined />}
                size="large"
                block
              >
                Sign In
              </Button>
            </Form>
          ),
        },
        {
          key: "register",
          label: "Create Account",
          children: (
            <Form layout="vertical" onFinish={onRegister}>
              <Form.Item
                name="fullName"
                label="Full Name"
                rules={[
                  { required: true, message: "Full name is required." },
                  {
                    min: 3,
                    message: "Full name must be at least 3 characters.",
                  },
                ]}
              >
                <Input
                  size="large"
                  placeholder="Enter your full name"
                  autoComplete="name"
                />
              </Form.Item>

              <Form.Item
                name="email"
                label="Email Address"
                rules={[
                  { required: true, message: "Email address is required." },
                  {
                    type: "email",
                    message: "Please enter a valid email address.",
                  },
                ]}
              >
                <Input
                  size="large"
                  placeholder="Enter your email address"
                  autoComplete="email"
                />
              </Form.Item>

              <Form.Item
                name="password"
                label="Password"
                rules={[
                  { required: true, message: "Password is required." },
                  {
                    min: 6,
                    message: "Password must be at least 6 characters.",
                  },
                ]}
              >
                <Input.Password
                  size="large"
                  placeholder="Create a password"
                  autoComplete="new-password"
                />
              </Form.Item>

              <Button
                loading={loading}
                type="primary"
                htmlType="submit"
                size="large"
                block
              >
                Create Account
              </Button>
            </Form>
          ),
        },
      ]}
    />
  );
}
