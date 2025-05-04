import FormLabel from "@/components/custom/FormLabel";
import { Text } from "@/components/ui/text";
import { VStack } from "@/components/ui/vstack";
import { Link, useNavigation } from "expo-router";
import { useEffect, useLayoutEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { NativeStackNavigationOptions } from "@react-navigation/native-stack/src/types";
import { Pressable, ScrollView, View, Image } from "react-native";
import { useForm, useStore } from "@tanstack/react-form";
import { authStore, authStoreListBags } from "@/store/auth";
import { Input, InputField } from "@/components/ui/input";
import { HStack } from "@/components/ui/hstack";
import { Button, ButtonIcon, ButtonText } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import { CheckIcon, LoaderIcon } from "lucide-react-native";
import { bulkyItemPut } from "@/api/bag";
import { savedStore } from "@/store/saved";
import { useQueryClient } from "@tanstack/react-query";
import { Bag } from "@/api/typex2";
import * as ImagePicker from "expo-image-picker";
import { uploadImage } from "@/api/imgbb";

export default function BulkyPatch(props: { bag: Bag | null }) {
  const { t } = useTranslation();

  const authUser = useStore(authStore, (s) => s.authUser);
  const chainUid = useStore(savedStore, (s) => s.chainUID);
  const queryClient = useQueryClient();
  //   const listBags = useStore(authStoreListBags);
  const navigation = useNavigation();
  const [image, setImage] = useState<string | undefined>(undefined);
  const [aspectRatio, setAspectRatio] = useState<number>(1);
  const [loading, setLoading] = useState(false);

  const form = useForm({
    defaultValues: {
      title: "",
      message: "",
    },
    async onSubmit({ value }) {
      console.log("on submit");
      try {
        console.log("image value:", image);

        await bulkyItemPut({
          chain_uid: chainUid,
          user_uid: authUser!.uid,
          title: value.title,
          message: value.message,
          image_url: image,
        });
        console.log("test 1");
      } catch (error) {
        console.error("Error during form submission", error);
      }
      queryClient.invalidateQueries({
        queryKey: ["auth", "chain-bags", chainUid],
        exact: true,
      });
      console.log("test 2");

      navigation.goBack();
    },
  });
  const pickImage = async () => {
    setImage(undefined);
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      quality: 1,
      base64: true,
    });

    //console.log(result);

    if (!result.canceled) {
      setLoading(true);

      const _image = result.assets[0].base64;
      //if (_image) setImage(_image);
      if (result.assets[0].width && result.assets[0].height) {
        setAspectRatio(result.assets[0].width / result.assets[0].height);
      }
      if (_image && result.assets[0].fileSize)
        uploadImgDB(_image, result.assets[0].fileSize);
      //  let im = await uploadImage(_image, result.assets[0].fileSize);
    }
  };

  const uploadImgDB = async (Base64: string, fileSize: number) => {
    let result = await uploadImage(Base64, fileSize);
    setLoading(false);

    setImage(result.data.image);
    console.log("Here", result.data.image);
  };
  useEffect(() => {
    console.log(image, loading);
    navigation.setOptions({
      title: t("createBulkyItem"),
      headerRight: () => (
        <Pressable onPress={form.handleSubmit} className="px-2">
          <Text
            size="xl"
            className={`text-primary-500 ${loading ? "opacity-50" : ""}`}
          >
            {props.bag ? t("save") : t("create")}
          </Text>
        </Pressable>
      ),
    } satisfies NativeStackNavigationOptions);
  }, [navigation, t, props.bag, loading]);
  return (
    <ScrollView className="bg-background-0">
      <VStack className="gap-3 p-3">
        <form.Field name="title">
          {(field) => (
            <FormLabel label={t("bulkyItemName")}>
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
            <FormLabel label={t("bulkyItemDesc")}>
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
        <View>
          <Button onPress={pickImage}>
            <ButtonText>{loading ? "" : t("upload")}</ButtonText>
            {loading && <LoaderIcon />}
          </Button>
          {image && (
            <Image
              source={{ uri: image }}
              style={{ width: "100%", aspectRatio }}
              className="mx-auto mt-4"
            />
          )}
        </View>
      </VStack>
    </ScrollView>
  );
}
