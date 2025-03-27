import Hyperlink from "react-native-hyperlink";
import { useCallback } from "react";
import { Text } from "../ui/text";
import { VStack } from "../ui/vstack";

export default function FormattedText(props: {
  content: string;
  allowLinks?: boolean;
}) {
  const res = useCallback(() => {
    const content = props.content
      .split("\n")
      .map((line, i) => <Text key={i}>{line}</Text>);

    return (
      <VStack>
        {content.map((c, i) =>
          props.allowLinks ? (
            <Hyperlink linkDefault key={i}>
              <Text>{content}</Text>
            </Hyperlink>
          ) : (
            <Text key={i}>{content}</Text>
          ),
        )}
      </VStack>
    );
  }, [props]);

  return res();
}
