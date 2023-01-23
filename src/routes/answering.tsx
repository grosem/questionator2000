import { Textarea, Grid, Button } from "@mantine/core";
import { showNotification } from "@mantine/notifications";
import { useState } from "react";
import QuestionList from "../components/questionList";
import qrcode from "../assets/qr.png";

export default function Answering() {
  const [question, setQuestion] = useState("");

  return (
    <Grid justify="center">
      <Grid.Col style={{ maxWidth: "500px" }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            flexDirection: "column",
          }}
        >
          <img src={qrcode} style={{ width: "150px", marginBottom: "10px" }} />
          <span>Scan to ask questions</span>
        </div>

        <QuestionList admin></QuestionList>
      </Grid.Col>
    </Grid>
  );
}
