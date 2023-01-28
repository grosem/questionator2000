import { useEffect, useState } from "react";
import {
  onChildAdded,
  onChildRemoved,
  onChildChanged,
} from "firebase/database";
import Database from "../database";
import { Card, Chip, Flex } from "@mantine/core";

interface Question {
  id: string;
  question: string;
  votes: number;
  didUpvote: boolean;
}

export default function QuestionList(props: any) {
  const [questionList, setQuestionList] = useState<Question[]>([]);
  /*
    setQuestionList is async. onChildAdded is called multiple times and reading the not-always-updated questionList.
    Not sure how to do that better, so I use syncQuestionList as a workaround.
    */
  let syncQuestionList: Question[] = [];
  let didRun = false; // ridiculous workaround based on https://beta.reactjs.org/learn/you-might-not-need-an-effect

  // get questions from firebase
  useEffect(() => {
    if (didRun) {
      return;
    }
    didRun = true;
    const ref = Database.getQuestionRef();

    onChildAdded(ref, (snapshot) => {
      const data = snapshot.val();
      data.didUpvote = false;
      data.id = snapshot.key;
      syncQuestionList = [...syncQuestionList, data];
      syncQuestionList = syncQuestionList.sort((a, b) => b.votes - a.votes);
      setQuestionList([...syncQuestionList]);
    });

    onChildChanged(ref, (snapshot) => {
      const data = snapshot.val();
      const question = syncQuestionList.find((q) => q.id === snapshot.key);
      question!.votes = data.votes;
      syncQuestionList = syncQuestionList.sort((a, b) => b.votes - a.votes);
      console.log("jo", syncQuestionList);
      setQuestionList([...syncQuestionList]);
    });

    onChildRemoved(ref, (snapshot) => {
      syncQuestionList = syncQuestionList.filter(
        (question) => question.id !== snapshot.key
      );
      setQuestionList([...syncQuestionList]);
    });
  }, []);

  function updateVote(question: Question) {
    if (question.didUpvote) {
      return;
    }
    question.didUpvote = true;
    Database.addVote(question.id);
    // next call is competing with onChildChanged which can lead to problems
    //setQuestionList([...questionList]);
  }

  return (
    <div>
      <ul style={{ paddingLeft: 0 }}>
        {questionList.map((question, index) => {
          return (
            <li
              key={index}
              style={{ marginBottom: "5px" }}
              onDoubleClick={() => {
                if (props.admin) {
                  Database.deleteQuestion(question.id);
                }
              }}
            >
              <Card withBorder shadow="sm" radius="md">
                <Card.Section withBorder inheritPadding py="lg">
                  <Flex align="center" gap="md">
                    <Chip
                      checked={question.didUpvote}
                      onChange={() => updateVote(question)}
                    >
                      +{question.votes}
                    </Chip>
                    <span
                      style={{ userSelect: "none", WebkitUserSelect: "none" }}
                    >
                      {question.question}
                    </span>
                  </Flex>
                </Card.Section>
              </Card>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
