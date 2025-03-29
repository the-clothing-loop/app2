import { HStack } from "@/components/ui/hstack";
import { Text } from "@/components/ui/text";
import { VStack } from "@/components/ui/vstack";
import { useCallback, useMemo, useRef, useState } from "react";
import FormattedText from "../FormattedText";
import { Box } from "@/components/ui/box";
import { Button, ButtonText } from "@/components/ui/button";
import { UID } from "@/api/types";
import { chainChangeUserNote, chainGetUserNote } from "@/api/chain";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";

import { useDebounceCallback } from "usehooks-ts";
import { Input } from "@/components/ui/input";
import { Textarea, TextareaInput } from "@/components/ui/textarea";
import { useForm } from "@tanstack/react-form";
import { Icon } from "@/components/ui/icon";
import { CircleCheckBigIcon, CircleDashedIcon } from "lucide-react-native";
import { TextareaContext } from "@gluestack-ui/textarea/lib/types";
import { TextInputProps } from "react-native";

export default function NoteEdit(props: {
  currentChainUid: undefined | UID;
  thisUserUid: undefined | UID;
  isNoteEditable: boolean;
}) {
  const { t } = useTranslation();
  const [showNoteEdit, setShowNoteEdit] = useState(false);
  const queryNote = useQuery({
    queryKey: [
      "auth",
      "chain-user-note",
      props.currentChainUid,
      props.thisUserUid,
    ],
    queryFn() {
      return chainGetUserNote(props.currentChainUid!, props.thisUserUid!);
    },
    enabled: Boolean(props.currentChainUid && props.thisUserUid),
  });
  const mutateNote = useMutation({
    async mutationFn(note: string) {
      if (!props.thisUserUid) throw "not logged in";
      if (!props.currentChainUid) throw "select a loop first";
      return await chainChangeUserNote(
        props.currentChainUid,
        props.thisUserUid,
        note,
      ).finally(async () => {
        await queryNote.refetch();
      });
    },
  });
  const form = useForm({
    defaultValues: {
      note: "",
    },
    onSubmit({ value }) {
      return mutateNote.mutateAsync(value.note);
    },
  });
  const delayedFormSubmit = useDebounceCallback(() => {
    form.handleSubmit();
  }, 3000);
  function toggleShowNoteEdit() {
    const open = !showNoteEdit;
    setShowNoteEdit(open);
    if (open) {
      form.setFieldValue("note", queryNote.data || "", {
        dontUpdateMeta: true,
      });
    } else {
      delayedFormSubmit.flush();
    }
  }
  const isDirty = useMemo(
    () => queryNote.data !== form.state.values.note,
    [form.state.values.note, queryNote],
  );

  return (
    <HStack className="gap-2 px-4 py-2">
      <VStack className="flex-grow">
        <Text bold size="sm">
          {t("notes")}
        </Text>
        {showNoteEdit ? (
          <Box className="relative">
            <Box
              className={`absolute right-2 top-2 z-10 h-4 w-4 rounded-full ${isDirty ? "bg-warning-300" : "bg-success-300"}`}
            />
            <form.Field
              name="note"
              listeners={{
                onChange() {
                  delayedFormSubmit();
                },
              }}
            >
              {(field) => (
                <Textarea>
                  <TextareaInput
                    value={field.state.value}
                    onChangeText={field.setValue}
                    onBlur={() => delayedFormSubmit()}
                    submitBehavior="newline"
                  />
                </Textarea>
              )}
            </form.Field>
          </Box>
        ) : (
          <FormattedText content={queryNote.data || t("empty")} />
        )}
      </VStack>
      <Box>
        {props.isNoteEditable ? (
          <Button size="sm" onPress={toggleShowNoteEdit}>
            <ButtonText>{showNoteEdit ? t("save") : t("edit")}</ButtonText>
          </Button>
        ) : null}
      </Box>
    </HStack>
  );
}
