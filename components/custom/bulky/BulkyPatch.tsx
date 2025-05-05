import FormLabel from "@/components/custom/FormLabel";
import { Text } from "@/components/ui/text";
import { VStack } from "@/components/ui/vstack";
import { useNavigation } from "expo-router";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { NativeStackNavigationOptions } from "@react-navigation/native-stack/src/types";
import {
  Pressable,
  ScrollView,
  View,
  Image,
  ActivityIndicator,
} from "react-native";
import { useForm, useStore } from "@tanstack/react-form";
import { authStore } from "@/store/auth";
import { Input, InputField } from "@/components/ui/input";
import { Button, ButtonText } from "@/components/ui/button";
import { bulkyItemPut } from "@/api/bag";
import { savedStore } from "@/store/saved";
import { useQueryClient } from "@tanstack/react-query";
import { BulkyItem } from "@/api/typex2";
import * as ImagePicker from "expo-image-picker";
import { uploadImage } from "@/api/imgbb";
import { Textarea, TextareaInput } from "@/components/ui/textarea";

export default function BulkyPatch(props: { BulkyItem: BulkyItem | null }) {
  const { t } = useTranslation();

  const authUser = useStore(authStore, (s) => s.authUser);
  const chainUid = useStore(savedStore, (s) => s.chainUID);
  const queryClient = useQueryClient();
  //   const listBags = useStore(authStoreListBags);
  const navigation = useNavigation();
  const [image, setImage] = useState<string | undefined>(undefined);
  const [loading, setLoading] = useState(false);
  const [afterSubmit, setAfterSubmit] = useState(false);

  const form = useForm({
    defaultValues: {
      title: props.BulkyItem?.title || "",
      message: props.BulkyItem?.message || "",
    },
    async onSubmit({ value }) {
      try {
        await bulkyItemPut({
          chain_uid: chainUid,
          user_uid: authUser!.uid,
          title: value.title,
          message: value.message,
          image_url: image,
        });
        setAfterSubmit(true);
      } catch (error) {
        console.error("Error during form submission", error);
      }
      queryClient.invalidateQueries({
        queryKey: ["auth", "chain-bags", chainUid],
        exact: true,
      });

      navigation.goBack();
    },
  });
  useEffect(() => {
    if (props.BulkyItem?.image_url) {
      setImage(props.BulkyItem.image_url);
    }
  }, [props.BulkyItem]);
  const pickImage = async () => {
    setImage(undefined);
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      quality: 1,
      base64: true,
    });

    if (!result.canceled) {
      setLoading(true);

      const _image = result.assets[0].base64;
      if (_image && result.assets[0].fileSize)
        uploadImgDB(_image, result.assets[0].fileSize);
    }
  };

  const uploadImgDB = async (Base64: string, fileSize: number) => {
    let result = await uploadImage(Base64, fileSize);
    setLoading(false);

    setImage(result.data.image);
  };
  useEffect(() => {
    navigation.setOptions({
      title: `${props.BulkyItem ? t("updateBulkyItem") : t("createBulkyItem")}`,
      headerRight: () => (
        <Pressable
          disabled={loading}
          onPress={form.handleSubmit}
          className="px-2"
        >
          <Text
            size="xl"
            className={`text-primary-500 ${loading ? "opacity-50" : ""}`}
          >
            {props.BulkyItem ? t("save") : t("create")}
          </Text>
        </Pressable>
      ),
    } satisfies NativeStackNavigationOptions);
  }, [navigation, t, props.BulkyItem, loading]);
  return (
    <>
      {afterSubmit ? (
        <View className="h-[100vh] flex-1 items-center justify-center bg-background-0">
          <ActivityIndicator color="#5f9c8a" size="large" />
        </View>
      ) : (
        <ScrollView className="bg-background-0">
          <VStack className="gap-3 p-3">
            <form.Field name="title">
              {(field) => (
                <FormLabel label={t("bulkyItemsTitle")}>
                  <>
                    <Input>
                      <InputField
                        value={field.state.value}
                        onChangeText={field.setValue}
                      />
                    </Input>
                  </>
                </FormLabel>
              )}
            </form.Field>
            <form.Field name="message">
              {(field) => (
                <FormLabel label={t("description")}>
                  <>
                    <Textarea>
                      <TextareaInput
                        multiline
                        numberOfLines={4}
                        value={field.state.value}
                        onChangeText={field.setValue}
                      />
                    </Textarea>
                  </>
                </FormLabel>
              )}
            </form.Field>
            <View>
              <Button onPress={pickImage}>
                <ButtonText>
                  <Text className="text-white">
                    {loading ? "" : t("upload")}
                  </Text>
                </ButtonText>
                {loading && <ActivityIndicator color="#ffffff" />}
              </Button>
              {image && (
                <Image
                  source={{ uri: image }}
                  style={{ width: "100%", height: 200, resizeMode: "contain" }}
                  className="mx-auto mt-4"
                />
              )}
            </View>
          </VStack>
        </ScrollView>
      )}
    </>
  );
}
