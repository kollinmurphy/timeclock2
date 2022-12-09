import { Box, Divider, VStack } from "native-base";
import React from "react";

const ErrorAlert = ({ error }: { error: null | string }) => {
  return error ? (
    <Box borderRadius="md" bgColor="red.400" my="3">
      <VStack space="4" divider={<Divider />}>
        <Box p={4}>{error}</Box>
      </VStack>
    </Box>
  ) : null;
};

export default React.memo(ErrorAlert);
