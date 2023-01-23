import { Textarea, Grid, Button } from "@mantine/core";
import { showNotification } from "@mantine/notifications";
import { useState } from "react";
import QuestionList from "../components/questionList";
import Database from "../database";

export default function Asking() {
  const [question, setQuestion] = useState("");

  //add questio
  function addQuestion() {
    Database.addQuestion(question).then(() => {
      showNotification({
        title: "Done",
        message: "Your question has been added 😎",
      });
      setQuestion("");
    });
  }

  return (
    <Grid justify="center">
      <Grid.Col style={{ maxWidth: "500px" }}>
        <Textarea
          value={question}
          onChange={(e) => setQuestion(e.currentTarget.value)}
          placeholder="Your Question"
          maxLength={160}
          variant="filled"
          radius="md"
          size="xl"
          minRows={2}
          maxRows={4}
          withAsterisk
          style={{ marginBottom: 5 }}
        />
        <Button
          fullWidth
          variant="gradient"
          gradient={{ from: "indigo", to: "cyan" }}
          onClick={(e) => addQuestion()}
          disabled={question.trim().length === 0}
        >
          Send
        </Button>
        <QuestionList></QuestionList>
      </Grid.Col>
    </Grid>
  );
}
