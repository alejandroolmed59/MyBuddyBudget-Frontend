import React, { useState, useEffect, useContext } from "react";
import {
  Row,
  Col,
  Statistic,
  Card,
  Button,
  InputNumber,
  Select,
  message,
  Space,
  Carousel,
} from "antd";
import {
  ArrowUpOutlined,
  MoneyCollectOutlined,
  WalletFilled,
} from "@ant-design/icons";
import { useGetWalletsByNameQuery } from "../../redux/slice/walletsSlice";
import AuthContext from "../../context/auth-context";
import axios from "axios";
import currencies, {carrouselContentStyle} from "../../assets/currencies";

const { Option } = Select;

const WalletDetail = ({ wallet }) => {
  const [amount, setAmount] = useState(0);
  const [wallets, setWallets] = useState([]);
  const [selectedWallet, setSelectedWallet] = useState("");

  const { currentUser } = useContext(AuthContext);

  const { data, isSuccess } = useGetWalletsByNameQuery(currentUser.displayName);
  //wallet.cuenta, wallet.descripcion, wallet.saldo
  useEffect(() => {
    if (isSuccess && data) setWallets(data);
  }, [data, isSuccess]);

  const transferir = async () => {
    try {
      await axios.post(
        `${process.env.REACT_APP_BACKEND_BASE_URL}/account/transfer`,
        {
          walletIdOrigen: wallet.cuenta,
          walletIdDestino: selectedWallet,
          amount: amount,
        }
      );
      message.success("transferencia realizada con exito");
    } catch (e) {
      message.error("ocurrio un error");
    }
  };

  return (
    <>
      <Carousel autoplay>
        {currencies.map((curr)=>(
          <Card>
            <h1 style={carrouselContentStyle}>{curr.curr}</h1>
            <h3 style={carrouselContentStyle}>{curr.price}</h3>
          </Card>
        ))}
      </Carousel>
      <Row
        gutter={[16, 16]}
        style={{ margin: "3rem", width:"70%"}}
        className="vertical-center"
      >
        <Col span={12}>
          <Card>
            <Statistic title="Account Name" value={wallet.descripcion} />
          </Card>
        </Col>
        <Col span={12}>
          <Card>
            <Statistic
              prefix={<ArrowUpOutlined />}
              title="Account Balance"
              value={wallet.saldo}
              valueStyle={{ color: "#3f8600" }}
              precision={2}
              suffix="$"
            />
          </Card>
        </Col>
        <Col span={12}>
          <Card>
            <Statistic
              title="Account Type"
              value={wallet.CuentaTypoObj.descripcion}
            />
          </Card>
        </Col>
        <Col span={12}>
          <Card>
            <Statistic
              prefix={<MoneyCollectOutlined />}
              title="Currecy"
              value={wallet.MonedaObj.descripcion}
            />
          </Card>
        </Col>
        <Col span={24}>
          <Space size={10}>
            <InputNumber
              min={0}
              formatter={(value) => `$ ${value}`}
              onChange={(value) => {
                setAmount(value);
              }}
            ></InputNumber>
            <Select
              showSearch
              style={{ width: 200 }}
              placeholder={
                <>
                  <WalletFilled className="site-form-item-icon" /> Select a
                  wallet
                </>
              }
              optionFilterProp="children"
              onChange={(value) => setSelectedWallet(value)}
            >
              {wallets.map((wallet) => {
                return (
                  <Option value={wallet.cuenta}>
                    {wallet.descripcion} - ${wallet.saldo}
                  </Option>
                );
              })}
            </Select>
            <Button onClick={() => transferir()}>Transferir</Button>
          </Space>
        </Col>
      </Row>
    </>
  );
};

export default WalletDetail;
