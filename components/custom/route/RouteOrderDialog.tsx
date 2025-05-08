import {
  AlertDialog,
  AlertDialogBackdrop,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
} from "@/components/ui/alert-dialog";
import { Button, ButtonText } from "@/components/ui/button";
import { Text } from "@/components/ui/text";
import {
  Dispatch,
  SetStateAction,
  useLayoutEffect,
  useMemo,
  useState,
} from "react";
import { useTranslation } from "react-i18next";
import { useDefaultStyles } from "react-native-ui-datepicker";
import { FilteredRouteUsersSort } from "@/hooks/useFilteredRouteUsers";
import {
  Radio,
  RadioGroup,
  RadioIcon,
  RadioIndicator,
  RadioLabel,
} from "@/components/ui/radio";
import { CircleIcon } from "lucide-react-native";

export default function RouteOrderDialog(props: {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  selected: FilteredRouteUsersSort;
  onSubmit: (o: FilteredRouteUsersSort) => void;
  routeUsersLen: number;
}) {
  const { t } = useTranslation();
  const orderList = useMemo<
    { userSort: FilteredRouteUsersSort; textI18n: string }[]
  >(
    () => [
      {
        userSort: "routeForMe",
        textI18n: t("routeForMe"),
      },
      {
        userSort: "route1toN",
        textI18n: t("route1toN", { count: props.routeUsersLen }),
      },
      {
        userSort: "aToZ",
        textI18n: t("aToZ"),
      },
      {
        userSort: "zToA",
        textI18n: t("zToA"),
      },
      {
        userSort: "dateLastSwapped",
        textI18n: t("dateLastSwapped"),
      },
      {
        userSort: "dateLastSwappedRev",
        textI18n: t("dateLastSwappedRev"),
      },
    ],
    [t, props.routeUsersLen],
  );

  const [selected, setSelected] = useState(() => props.selected);
  useLayoutEffect(() => {
    setSelected(props.selected);
  }, [props.selected]);
  function handleClose() {
    props.setOpen(false);
    props.onSubmit(selected);
  }
  const defaultStyles = useDefaultStyles();

  return (
    <AlertDialog
      useRNModal
      closeOnOverlayClick={false}
      isOpen={props.open}
      onClose={handleClose}
      size="md"
    >
      <AlertDialogBackdrop />
      <AlertDialogContent>
        <AlertDialogHeader>
          <Text className="mb-3 font-semibold text-typography-950" size="xl">
            {t("order")}
          </Text>
        </AlertDialogHeader>
        <AlertDialogBody className="py-3">
          <RadioGroup onChange={setSelected} value={selected}>
            {orderList.map((v) => (
              <Radio value={v.userSort} key={v.userSort}>
                <RadioIndicator>
                  <RadioIcon as={CircleIcon} />
                </RadioIndicator>
                <RadioLabel>{v.textI18n}</RadioLabel>
              </Radio>
            ))}
          </RadioGroup>
        </AlertDialogBody>
        <AlertDialogFooter className="mt-3 flex-col items-stretch gap-4">
          <Button
            size="lg"
            variant="outline"
            action="secondary"
            onPress={handleClose}
          >
            <ButtonText>Close</ButtonText>
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
