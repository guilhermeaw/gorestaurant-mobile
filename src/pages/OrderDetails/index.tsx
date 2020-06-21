import React, { useEffect, useState, useMemo } from 'react';
import { Image } from 'react-native';

import { useRoute } from '@react-navigation/native';
import formatValue from '../../utils/formatValue';

import api from '../../services/api';

import {
  Container,
  Header,
  ScrollContainer,
  FoodsContainer,
  Food,
  FoodImageContainer,
  FoodContent,
  FoodTitle,
  FoodDescription,
  FoodPricing,
  AdditionalsContainer,
  Title,
  TotalContainer,
  AdittionalItem,
  AdittionalItemText,
  AdittionalQuantity,
  PriceButtonContainer,
  TotalPrice,
} from './styles';

interface Params {
  id: number;
}

interface Extra {
  id: number;
  name: string;
  value: number;
  quantity: number;
}

interface Order {
  id: number;
  name: string;
  description: string;
  price: number;
  image_url: string;
  formattedPrice: string;
  extras: Extra[];
}

const OrderDetails: React.FC = () => {
  const [order, setOrder] = useState({} as Order);
  const [extras, setExtras] = useState<Extra[]>([]);

  const route = useRoute();

  const routeParams = route.params as Params;

  useEffect(() => {
    async function loadOrder(): Promise<void> {
      const { id } = routeParams;

      const response = await api.get<Order>(`orders/${id}`);

      setOrder(response.data);

      setExtras(response.data.extras);
    }

    loadOrder();
  }, [routeParams]);

  const formattedPrice = useMemo(() => {
    return formatValue(order.price);
  }, [order.price]);

  return (
    <Container>
      <Header />

      <ScrollContainer>
        <FoodsContainer>
          <Food>
            <FoodImageContainer>
              <Image
                style={{ width: 327, height: 183 }}
                source={{
                  uri: order.image_url,
                }}
              />
            </FoodImageContainer>
            <FoodContent>
              <FoodTitle>{order.name}</FoodTitle>
              <FoodDescription>{order.description}</FoodDescription>
              <FoodPricing>{order.formattedPrice}</FoodPricing>
            </FoodContent>
          </Food>
        </FoodsContainer>
        <AdditionalsContainer>
          <Title>Adicionais</Title>
          {extras.map(extra => (
            <AdittionalItem key={extra.id}>
              <AdittionalItemText>{extra.name}</AdittionalItemText>
              <AdittionalQuantity>
                <AdittionalItemText>{extra.quantity}</AdittionalItemText>
              </AdittionalQuantity>
            </AdittionalItem>
          ))}
        </AdditionalsContainer>
        <TotalContainer>
          <Title>Total do pedido</Title>
          <PriceButtonContainer>
            <TotalPrice>{formattedPrice}</TotalPrice>
          </PriceButtonContainer>
        </TotalContainer>
      </ScrollContainer>
    </Container>
  );
};

export default OrderDetails;
