import { describe, expect, test } from "bun:test";
import { buildPrompt, parseGeneratedAnswer, resultPayload, SYSTEM_PROMPT } from "./rag-response";

const passage = {
  id: "chunk-1",
  source: "/data/corpus/123e4567-e89b-42d3-a456-426614174000.md",
  score: 1,
  metadata: {},
  content:
    "# Matlaboul Fawzeyni\n\nChunk-ID: 123e4567-e89b-42d3-a456-426614174000\n\n## Traduction française\nTouba est évoquée dans ce passage.",
};

describe("RAG response contract", () => {
  test("builds a bounded source-numbered prompt", () => {
    const prompt = buildPrompt("Quels passages parlent de Touba ?", [passage]);
    expect(prompt).toContain("[1] Source:");
    expect(prompt).toContain("/no_think");
    expect(SYSTEM_PROMPT).toContain("Ne décris jamais ton raisonnement");
  });

  test("preserves the stable source identifier", () => {
    expect(resultPayload([passage])[0]).toMatchObject({
      number: 1,
      title: "Matlaboul Fawzeyni",
      source: passage.source,
    });
  });

  test("accepts only a structured final answer", () => {
    expect(parseGeneratedAnswer('{"answer":"Réponse française [1]."}')).toBe(
      "Réponse française [1].",
    );
    expect(parseGeneratedAnswer("unstructured reasoning")).toBeNull();
  });
});
