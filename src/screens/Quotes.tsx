import { useCallback, useMemo, memo } from "react";
import { useFocusEffect } from "@react-navigation/native";
import { Text } from "@react-navigation/elements";
import { ActivityIndicator } from "react-native";
import styled from "styled-components/native";
import { observer } from "mobx-react";
import { useQuotesStore } from "../store";
import QuotesTable from "../organisms/QuotesTable";

const Container = styled.View`
  flex: 1;
  width: 100%;
  height: 100%;
  justify-content: center;
  align-items: center;
  padding: 16px 8px;
`;

const ErrorContainer = styled.View`
  flex: 1;
  width: 100%;
  justify-content: center;
  align-items: center;
`;

const ContainerWithBorder = styled.View`
  width: 70%;

  align-items: center;
  justify-content: center;
  padding: 16px;
  align-self: center;

  border-color: #0388fc;
  border-width: 1px;
  border-radius: 8px;
`;

const AbsoluteView = styled(ContainerWithBorder)`
  position: absolute;
  z-index: 2;
  top: 16;
`;

const QuotesScreen = observer(() => {
  const store = useQuotesStore();

  useFocusEffect(
    useCallback(() => {
      store.startFetching();
      return () => store.stopFetching();
    }, [])
  );

  const renderError = useMemo(
    () => (
      <ErrorContainer>
        <AbsoluteView>
          <Text>{store.error}</Text>
        </AbsoluteView>
        <ActivityIndicator size="large" color="#0388fc" />
      </ErrorContainer>
    ),
    [store.error]
  );

  return (
    <Container>
      {store.error ? (
        renderError
      ) : !store.loading && store.quotes.length > 0 ? (
        <QuotesTable data={store.quotes} />
      ) : (
        <ActivityIndicator size="large" color="#0388fc" />
      )}
    </Container>
  );
});

export default memo(QuotesScreen);
