import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ArrowLeft, Save, Edit, Check, Plus, Upload, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useDemoMode } from "@/hooks/use-demo-mode";

interface ReferralQuestion {
  id: string;
  question: string;
  answer: string;
  images: File[];
  savedImageData?: Array<{
    name: string;
    type: string;
    dataUrl: string;
  }>;
}

interface ReferralData {
  questions: ReferralQuestion[];
}

const defaultQuestions = [
  "What is the present lumbar range of motion noted for the client?",
  "What is the present range of motion noted for the client for the affected area of injury?",
  "What is the present strength noted for the client for the affected area of injury?",
  "What are the present limitations to returning to full duties in their previous position?",
  "What accommodations could be made to the workplace to provide increased abilities/comfort to the client based on the present condition?",
  "6a) Was the client consistent and reliable in their efforts?",
  "6b) Distraction test consistency - When performing distraction tests for sustained posture the client should demonstrate similar limitations and or abilities. Pass/Fail determination:",
  "6c) Consistency with diagnosis - Based on the diagnosis and complaints of the individual it is expected that those issues would relate to a similar function performance pattern during testing. Pass/Fail determination:",
  "What would be the Physical Demand Classification (PDC) for this client?",
  "Conclusions?",
];

export default function ReferralQuestions() {
  const navigate = useNavigate();
  const isDemoMode = useDemoMode();
  const [referralData, setReferralData] = useState<ReferralData>({
    questions: defaultQuestions.map((q, index) => ({
      id: `default-${index + 1}`,
      question: q,
      answer: q.includes("Physical Demand Classification")
        ? "PDC:Sedentary|"
        : "",
      images: [],
    })),
  });

  const [isEditMode, setIsEditMode] = useState(false);
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadingImages, setUploadingImages] = useState<string | null>(null);

  const sampleReferralData = {
    questions: [
      {
        id: "default-1",
        question:
          "What is the present lumbar range of motion noted for the client?",
        answer:
          "Flexion: 45° (limited), Extension: 15° (limited), Lateral flexion: Left 20°, Right 18°. Significant restrictions noted with pain at end range.",
        images: [],
        savedImageData: [],
      },
      {
        id: "default-2",
        question:
          "What is the present range of motion noted for the client for the affected area of injury?",
        answer:
          "L4-L5 region shows marked limitation. Forward flexion produces pain at 45°, side bending limited to 20° bilaterally with protective muscle guarding.",
        images: [],
        savedImageData: [],
      },
      {
        id: "default-3",
        question:
          "What is the present strength noted for the client for the affected area of injury?",
        answer:
          "Manual muscle testing reveals 4/5 strength in hip flexors, 3+/5 in back extensors. Significant weakness noted during sustained contractions.",
        images: [],
        savedImageData: [],
      },
      {
        id: "default-4",
        question:
          "What are the present limitations to returning to full duties in their previous position?",
        answer:
          "Cannot perform heavy lifting >20lbs, prolonged standing >30min, or repetitive bending.",
        images: [],
        savedImageData: [],
      },
      {
        id: "default-5",
        question:
          "What accommodations could be made to the workplace to provide increased abilities/comfort to the client based on the present condition?",
        answer:
          "Ergonomic workstation setup, mechanical lifting aids, job rotation every 2 hours, modified work schedule with frequent breaks.",
        images: [],
        savedImageData: [],
      },
      {
        id: "default-6",
        question:
          "6a) Was the client consistent and reliable in their efforts?",
        answer:
          "Yes, client demonstrated consistent effort throughout evaluation. No signs of symptom magnification or malingering behaviors observed.",
        images: [],
        savedImageData: [],
      },
      {
        id: "default-7",
        question:
          "6b) Distraction test consistency - When performing distraction tests for sustained posture the client should demonstrate similar limitations and or abilities. Pass/Fail determination:",
        answer: "FAIL|",
        images: [],
        savedImageData: [],
      },
      {
        id: "default-8",
        question:
          "6c) Consistency with diagnosis - Based on the diagnosis and complaints of the individual it is expected that those issues would relate to a similar function performance pattern during testing. Pass/Fail determination:",
        answer: "FAIL|",
        images: [],
        savedImageData: [],
      },
      {
        id: "default-9",
        question:
          "What would be the Physical Demand Classification (PDC) for this client?",
        answer: "PDC:Light|",
        images: [],
        savedImageData: [],
      },
      {
        id: "default-10",
        question: "Conclusions?",
        answer:
          "Based on the comprehensive functional capacity evaluation, this client demonstrates light duty work capacity. Recommendations include occasional lifting up to 20lbs, frequent lifting up to 10lbs, with restrictions on prolonged static positioning. Return to work feasible with appropriate workplace accommodations and gradual progression.",
        images: [],
        savedImageData: [],
      },
    ],
  };

  const fillSampleReferralQuestions = async () => {
    setReferralData(sampleReferralData);
    setIsSubmitting(true);

    // Store sample data in localStorage
    localStorage.setItem(
      "referralQuestionsData",
      JSON.stringify(sampleReferralData),
    );

    // Update completed steps
    const completedSteps = JSON.parse(
      localStorage.getItem("completedSteps") || "[]",
    );
    if (!completedSteps.includes(4)) {
      completedSteps.push(4);
      localStorage.setItem("completedSteps", JSON.stringify(completedSteps));
    }

    setIsSubmitting(false);
    setShowSuccessDialog(true);
  };

  useEffect(() => {
    // Check if we have existing referral data (edit mode)
    const existingData = localStorage.getItem("referralQuestionsData");
    if (existingData) {
      const savedData = JSON.parse(existingData);

      // Migration: Fix question 4 if it contains the old unwanted text
      const updatedQuestions = savedData.questions.map((question: any) => {
        if (
          question.id === "default-4" &&
          question.question.includes(
            "What is your relationship with the referrer?",
          )
        ) {
          return {
            ...question,
            question:
              "What are the present limitations to returning to full duties in their previous position?",
          };
        }
        if (
          question.question &&
          question.question.includes(
            "Physical Demand Classification for this client?",
          ) &&
          !question.question.includes("(PDC)")
        ) {
          return {
            ...question,
            question:
              "What would be the Physical Demand Classification (PDC) for this client?",
          };
        }
        if (
          question.question &&
          question.question.includes("Physical Demand Classification") &&
          (!question.answer || !String(question.answer).startsWith("PDC:"))
        ) {
          return {
            ...question,
            answer: "PDC:Sedentary|",
          };
        }
        return question;
      });

      // Update savedData with migrated questions
      savedData.questions = updatedQuestions;

      // Convert saved image data back to File objects if they exist
      const questionsWithFiles = savedData.questions.map((question: any) => {
        const reconstructedFiles: File[] = [];
        if (question.savedImageData) {
          question.savedImageData.forEach((imageData: any) => {
            try {
              const byteCharacters = atob(imageData.dataUrl.split(",")[1]);
              const byteNumbers = new Array(byteCharacters.length);
              for (let i = 0; i < byteCharacters.length; i++) {
                byteNumbers[i] = byteCharacters.charCodeAt(i);
              }
              const byteArray = new Uint8Array(byteNumbers);
              const blob = new Blob([byteArray], { type: imageData.type });
              const file = new File([blob], imageData.name, {
                type: imageData.type,
              });
              reconstructedFiles.push(file);
            } catch (error) {
              console.error("Error reconstructing file:", error);
            }
          });
        }

        return {
          ...question,
          images: reconstructedFiles,
          savedImageData: question.savedImageData, // Keep both for display
        };
      });

      setReferralData({
        questions: questionsWithFiles,
      });

      // Save the migrated data back to localStorage
      localStorage.setItem(
        "referralQuestionsData",
        JSON.stringify({
          questions: questionsWithFiles,
        }),
      );

      setIsEditMode(true);
    }
  }, []);

  const handleAnswerChange = (questionId: string, answer: string) => {
    setReferralData((prev) => ({
      ...prev,
      questions: prev.questions.map((q) =>
        q.id === questionId ? { ...q, answer } : q,
      ),
    }));
  };

  const compressImage = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      // Check if we're in a browser environment
      if (
        typeof window === "undefined" ||
        typeof document === "undefined" ||
        typeof Image === "undefined"
      ) {
        // Fallback: use FileReader to convert to base64 without compression
        const reader = new FileReader();
        reader.onload = () => {
          resolve(reader.result as string);
        };
        reader.onerror = () => {
          reject(new Error("Failed to read file"));
        };
        reader.readAsDataURL(file);
        return;
      }

      try {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
        const img = new Image();

        if (!ctx) {
          throw new Error("Canvas context not available");
        }

        img.onload = () => {
          // Calculate new dimensions (max 1200px width/height)
          const maxSize = 1200;
          let { width, height } = img;

          if (width > height) {
            if (width > maxSize) {
              height = (height * maxSize) / width;
              width = maxSize;
            }
          } else {
            if (height > maxSize) {
              width = (width * maxSize) / height;
              height = maxSize;
            }
          }

          canvas.width = width;
          canvas.height = height;

          // Draw and compress
          ctx.drawImage(img, 0, 0, width, height);
          const compressedDataUrl = canvas.toDataURL("image/jpeg", 0.8); // 80% quality
          resolve(compressedDataUrl);
        };

        img.onerror = () => {
          reject(new Error("Failed to load image"));
        };

        img.src = URL.createObjectURL(file);
      } catch (error) {
        // Fallback to FileReader if canvas/Image fails
        const reader = new FileReader();
        reader.onload = () => {
          resolve(reader.result as string);
        };
        reader.onerror = () => {
          reject(new Error("Failed to read file"));
        };
        reader.readAsDataURL(file);
      }
    });
  };

  const handleImageUpload = async (
    questionId: string,
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const files = Array.from(event.target.files || []);
    if (files.length > 0) {
      const validFiles = files.filter((file) => file.size <= 10 * 1024 * 1024);
      if (validFiles.length !== files.length) {
        alert("Some files exceed 10MB limit and were not uploaded.");
      }

      if (validFiles.length === 0) return;

      setUploadingImages(questionId);

      try {
        // Process images immediately with compression (only in browser environment)
        const processedImages = await Promise.all(
          validFiles.map(async (file) => {
            try {
              const compressedDataUrl = await compressImage(file);
              return {
                name: file.name,
                type: file.type,
                dataUrl: compressedDataUrl,
              };
            } catch (error) {
              console.error("Error compressing image:", error);
              // Fallback: create a placeholder data URL
              return {
                name: file.name,
                type: file.type,
                dataUrl:
                  "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAMCAgMCAgMDAwMEAwMEBQgFBQQEBQoHBwYIDAoMDAsKCwsNDhIQDQ4RDgsLEBYQERMUFRUVDA8XGBYUGBIUFRT/2wBDAQMEBAUEBQkFBQkUDQsNFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBT/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwDX/9k=",
              };
            }
          }),
        );

        setReferralData((prev) => ({
          ...prev,
          questions: prev.questions.map((q) =>
            q.id === questionId
              ? {
                  ...q,
                  images: [...q.images, ...validFiles].slice(0, 5),
                  savedImageData: [
                    ...(q.savedImageData || []),
                    ...processedImages,
                  ].slice(0, 5),
                }
              : q,
          ),
        }));
      } catch (error) {
        console.error("Error processing images:", error);
        alert("Error processing images. Please try again.");
      } finally {
        setUploadingImages(null);
      }
    }
  };

  const removeImage = (questionId: string, imageIndex: number) => {
    setReferralData((prev) => ({
      ...prev,
      questions: prev.questions.map((q) =>
        q.id === questionId
          ? {
              ...q,
              images: q.images.filter((_, i) => i !== imageIndex),
              savedImageData: (q.savedImageData || []).filter(
                (_, i) => i !== imageIndex,
              ),
            }
          : q,
      ),
    }));
  };

  const addNewQuestion = () => {
    const newQuestion: ReferralQuestion = {
      id: `custom-${Date.now()}`,
      question: "",
      answer: "",
      images: [],
    };

    setReferralData((prev) => ({
      ...prev,
      questions: [...prev.questions, newQuestion],
    }));
  };

  const updateQuestion = (questionId: string, questionText: string) => {
    setReferralData((prev) => ({
      ...prev,
      questions: prev.questions.map((q) =>
        q.id === questionId ? { ...q, question: questionText } : q,
      ),
    }));
  };

  const removeQuestion = (questionId: string) => {
    setReferralData((prev) => ({
      ...prev,
      questions: prev.questions.filter((q) => q.id !== questionId),
    }));
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);

    // Images are already processed and stored in savedImageData, just clean up
    const questionsWithImageData = referralData.questions.map((question) => ({
      ...question,
      images: [], // Remove File objects for storage
    }));

    // Store data in localStorage (much faster now)
    const dataToSave = {
      questions: questionsWithImageData,
    };
    localStorage.setItem("referralQuestionsData", JSON.stringify(dataToSave));

    // Mark step 4 as completed
    const completedSteps = JSON.parse(
      localStorage.getItem("completedSteps") || "[]",
    );
    if (!completedSteps.includes(4)) {
      completedSteps.push(4);
      localStorage.setItem("completedSteps", JSON.stringify(completedSteps));
    }

    setIsSubmitting(false);
    setShowSuccessDialog(true);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="container mx-auto max-w-4xl">
        <div className="mb-8">
          <Button
            variant="outline"
            onClick={() => navigate("/dashboard")}
            className="mb-4"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Dashboard
          </Button>
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-4 flex items-center justify-center">
              {isEditMode && <Edit className="mr-3 h-8 w-8 text-orange-600" />}
              Referral Questions/Conclusions
              {isEditMode && (
                <span className="ml-3 text-2xl text-orange-600">
                  (Edit Mode)
                </span>
              )}
            </h1>
            <p className="text-xl text-gray-600">
              {isEditMode
                ? "Update referral questions and answers"
                : "Complete referral questions - no questions are mandatory"}
            </p>

            {/* Sample Referral Questions Button - Only show in demo mode */}
            {isDemoMode && !isEditMode && (
              <div className="mt-6">
                <Button
                  type="button"
                  onClick={fillSampleReferralQuestions}
                  className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 shadow-lg border-2 border-green-500"
                >
                  <Check className="mr-2 h-4 w-4" />
                  Fill Sample Referral Questions & Continue
                </Button>
                <p className="text-sm text-gray-500 mt-2">
                  Quick demo with pre-filled professional answers
                </p>
              </div>
            )}
          </div>
        </div>

        <Card className="shadow-lg">
          <CardHeader
            className={`text-white ${isEditMode ? "bg-orange-600" : "bg-blue-600"} flex flex-row items-center justify-between`}
          >
            <CardTitle className="text-2xl flex items-center">
              {isEditMode ? (
                <>
                  <Edit className="mr-3 h-6 w-6" />
                  Step 4: Edit Referral Questions
                </>
              ) : (
                <>
                  <div className="w-6 h-6 mr-3 bg-white text-blue-600 rounded-full flex items-center justify-center text-sm font-bold">
                    4
                  </div>
                  Step 4: Enter in Referral Questions
                </>
              )}
            </CardTitle>
            <Button
              onClick={addNewQuestion}
              variant="outline"
              className="bg-white text-blue-600 hover:bg-gray-100"
            >
              <Plus className="mr-2 h-4 w-4" />
              Add Referral Question
            </Button>
          </CardHeader>
          <CardContent className="p-8">
            <div className="space-y-8">
              {referralData.questions.map((question, index) => (
                <div key={question.id} className="space-y-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      {question.id.startsWith("custom-") ? (
                        <div className="space-y-2">
                          <div className="flex items-center space-x-2">
                            <span className="text-sm font-medium text-blue-600 whitespace-nowrap">
                              {(() => {
                                // Handle special 6a, 6b, 6c questions
                                if (
                                  question.question.startsWith("6a)") ||
                                  question.question.startsWith("6b)") ||
                                  question.question.startsWith("6c)")
                                ) {
                                  return "";
                                }
                                // Regular numbering
                                let questionNumber = index + 1;
                                if (index >= 8) questionNumber = index - 1;
                                return `${questionNumber}.`;
                              })()}
                            </span>
                            <Textarea
                              value={question.question}
                              onChange={(e) =>
                                updateQuestion(question.id, e.target.value)
                              }
                              placeholder="Enter your question here..."
                              className="flex-1"
                              rows={2}
                            />
                            <Button
                              onClick={() => removeQuestion(question.id)}
                              variant="outline"
                              size="sm"
                              className="text-red-600 hover:text-red-700"
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      ) : (
                        <p className="text-sm font-medium text-blue-600 mb-4">
                          {(() => {
                            // Handle special 6a, 6b, 6c questions
                            if (
                              question.question.startsWith("6a)") ||
                              question.question.startsWith("6b)") ||
                              question.question.startsWith("6c)")
                            ) {
                              return question.question;
                            }
                            // Regular numbering: 1-5 for first 5, then 7-8 for questions after 6c
                            let questionNumber = index + 1;
                            if (index >= 8) questionNumber = index - 1; // Questions after 6c become 7, 8
                            return `${questionNumber}. ${question.question}`;
                          })()}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Special UI for Physical Demand Classification (PDC) */}
                  {question.question.includes(
                    "Physical Demand Classification",
                  ) ? (
                    (() => {
                      const PDC_MAP: Record<
                        string,
                        { code: string; title: string; description: string }
                      > = {
                        Sedentary: {
                          code: "S",
                          title: "(S) Sedentary Work",
                          description:
                            "Exerting up to 10 lbs of force occasionally and/or a negligible amount of force frequently to lift, carry, push, pull, or otherwise move objects, including the human body. Sedentary work involves sitting most of the time but may involve walking or standing for brief periods of time. Jobs are sedentary if walking and standing are required occasionally and all other sedentary criteria are met.",
                        },
                        Light: {
                          code: "L",
                          title: "(L) Light Work",
                          description:
                            'Exerting up to 20 lb of force occasionally, and/or up to 10 lb of force frequently, and/or a negligible amount of force constantly to move objects. Physical demand requirements are in excess of those for sedentary work. Even though the weight lifted may be only negligible, a job should be rated "Light Work": (1) when it requires walking or standing to a significant degree; or (2) when it requires sitting most of the time but entails pushing and/or pulling of arm or leg controls; and/or (3) when the job requires working at a production rate pace entailing the constant pushing and/or pulling of materials even though the weight of those materials is negligible. The constant stress and strain of maintaining a production rate pace, especially in an industrial setting, can be and is physically exhausting.',
                        },
                        Medium: {
                          code: "M",
                          title: "(M) Medium Work",
                          description:
                            "Exerting 20 to 50 lbs of force occasionally, and/or 10 to 25 lbs of force frequently, and/or greater than negligible up to 10 lbs of force constantly to move objects. Physical demand requirements are in excess of those for light work.",
                        },
                        Heavy: {
                          code: "H",
                          title: "(H) Heavy Work",
                          description:
                            "Exerting 50 to 100 lbs of force occasionally, and/or 25 to 50 lbs of force frequently, and/or 10 to 20 lbs of force constantly to move objects. Physical demand requirements are in excess of those for medium work.",
                        },
                        "Very Heavy": {
                          code: "VH",
                          title: "(VH) Very Heavy Work",
                          description:
                            "Exerting over 100 lbs of force occasionally, over 50 lbs of force frequently, or over 20 lbs of force constantly to move objects. Physical demand requirements are in excess of those for heavy work.",
                        },
                      };

                      const current = question.answer.startsWith("PDC:")
                        ? question.answer.split("|")[0].replace("PDC:", "")
                        : "";
                      const comments = question.answer.startsWith("PDC:")
                        ? question.answer.split("|")[1] || ""
                        : "";

                      const setLevel = (level: keyof typeof PDC_MAP) => {
                        handleAnswerChange(
                          question.id,
                          `PDC:${level}|${comments}`,
                        );
                      };

                      const selected =
                        (current as keyof typeof PDC_MAP) || ("" as any);
                      const selectedInfo = (PDC_MAP as any)[current] || null;

                      return (
                        <div className="space-y-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Select PDC Level
                            </label>
                            <RadioGroup
                              value={current || "Sedentary"}
                              onValueChange={(val) =>
                                handleAnswerChange(
                                  question.id,
                                  `PDC:${val}|${comments}`,
                                )
                              }
                              className="grid grid-cols-1 sm:grid-cols-5 gap-3"
                            >
                              {Object.keys(PDC_MAP).map((level) => {
                                const id = `pdc-${question.id}-${level}`;
                                const isActive = current === level;
                                return (
                                  <label
                                    key={level}
                                    htmlFor={id}
                                    className={`flex items-center gap-2 p-2 rounded-md border cursor-pointer transition-colors ${
                                      isActive
                                        ? "bg-blue-600 border-blue-600 text-white shadow-sm"
                                        : "bg-white border-gray-300 hover:bg-gray-50 text-gray-800"
                                    }`}
                                  >
                                    <RadioGroupItem
                                      id={id}
                                      value={level}
                                      className={
                                        isActive
                                          ? "text-white border-white"
                                          : undefined
                                      }
                                    />
                                    <span className="text-sm font-medium">
                                      {level}
                                    </span>
                                  </label>
                                );
                              })}
                            </RadioGroup>
                          </div>

                          {selectedInfo && (
                            <div className="border rounded-md p-4 bg-white">
                              <p className="font-semibold text-blue-700 mb-2">
                                {selectedInfo.title}
                              </p>
                              <p className="text-sm text-gray-700 text-justify">
                                {selectedInfo.description}
                              </p>
                            </div>
                          )}

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Additional Comments
                            </label>
                            <Textarea
                              value={comments}
                              onChange={(e) => {
                                const level = current || "";
                                handleAnswerChange(
                                  question.id,
                                  `PDC:${level}|${e.target.value}`,
                                );
                              }}
                              placeholder="Enter any additional comments here..."
                              className="min-h-[120px]"
                            />
                          </div>
                        </div>
                      );
                    })()
                  ) : question.question.includes("Pass/Fail determination:") ? (
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Pass/Fail Determination
                        </label>
                        <div className="inline-flex bg-gray-200 rounded-lg p-1 w-full max-w-xs">
                          <button
                            type="button"
                            onClick={() => {
                              const comments = question.answer.includes("|")
                                ? question.answer.split("|")[1] || ""
                                : "";
                              handleAnswerChange(
                                question.id,
                                `PASS|${comments}`,
                              );
                            }}
                            className={`flex-1 py-2 px-4 text-sm font-medium rounded-md transition-all duration-200 ${
                              question.answer.startsWith("PASS")
                                ? "bg-blue-600 text-white shadow-sm"
                                : "text-gray-600 hover:text-gray-800"
                            }`}
                          >
                            Pass
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              const comments = question.answer.includes("|")
                                ? question.answer.split("|")[1] || ""
                                : "";
                              handleAnswerChange(
                                question.id,
                                `FAIL|${comments}`,
                              );
                            }}
                            className={`flex-1 py-2 px-4 text-sm font-medium rounded-md transition-all duration-200 ${
                              !question.answer.startsWith("PASS") ||
                              question.answer === ""
                                ? "bg-blue-600 text-white shadow-sm"
                                : "text-gray-600 hover:text-gray-800"
                            }`}
                          >
                            Fail
                          </button>
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Comments
                        </label>
                        <Textarea
                          value={
                            question.answer.includes("|")
                              ? question.answer.split("|")[1] || ""
                              : ""
                          }
                          onChange={(e) => {
                            const status = question.answer.includes("|")
                              ? question.answer.split("|")[0]
                              : "FAIL";
                            handleAnswerChange(
                              question.id,
                              `${status}|${e.target.value}`,
                            );
                          }}
                          placeholder="Enter your comments here..."
                          className="min-h-[120px]"
                        />
                      </div>
                    </div>
                  ) : (
                    <Textarea
                      value={question.answer}
                      onChange={(e) =>
                        handleAnswerChange(question.id, e.target.value)
                      }
                      placeholder="Enter your answer here..."
                      className="min-h-[120px]"
                    />
                  )}

                  {/* Hide image upload for 6b and 6c questions */}
                  {!question.question.includes("6b)") &&
                    !question.question.includes("6c)") && (
                      <div className="space-y-4">
                        <Button
                          type="button"
                          variant="outline"
                          disabled={uploadingImages === question.id}
                          onClick={() =>
                            document
                              .getElementById(`image-upload-${question.id}`)
                              ?.click()
                          }
                          className={`flex items-center ${
                            uploadingImages === question.id
                              ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                              : "bg-blue-100 text-blue-600 hover:bg-blue-200"
                          }`}
                        >
                          <Upload className="mr-2 h-4 w-4" />
                          {uploadingImages === question.id
                            ? "Processing..."
                            : "Upload Image Library"}
                        </Button>

                        <input
                          id={`image-upload-${question.id}`}
                          type="file"
                          accept="image/*"
                          multiple
                          onChange={(e) => handleImageUpload(question.id, e)}
                          className="hidden"
                        />

                        {/* Upload Progress Indicator */}
                        {uploadingImages === question.id && (
                          <div className="flex items-center justify-center p-4 border border-blue-200 rounded-lg bg-blue-50">
                            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600 mr-2"></div>
                            <span className="text-sm text-blue-600">
                              Processing images...
                            </span>
                          </div>
                        )}

                        {/* Uploaded Images Preview */}
                        {(question.savedImageData?.length > 0 ||
                          question.images.length > 0) && (
                          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                            {/* Show savedImageData first (processed images) */}
                            {question.savedImageData?.map(
                              (imageData, imageIndex) => (
                                <div
                                  key={`saved-${imageIndex}`}
                                  className="relative group"
                                >
                                  <img
                                    src={imageData.dataUrl}
                                    alt={`Uploaded ${imageIndex + 1}`}
                                    className="w-full h-24 object-cover rounded-lg border shadow-sm"
                                  />
                                  <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    onClick={() =>
                                      removeImage(question.id, imageIndex)
                                    }
                                    className="absolute top-1 right-1 h-6 w-6 p-0 bg-red-500 text-white hover:bg-red-600 opacity-0 group-hover:opacity-100 transition-opacity"
                                  >
                                    <X className="h-3 w-3" />
                                  </Button>
                                  <p className="text-xs text-gray-500 mt-1 truncate">
                                    {imageData.name}
                                  </p>
                                </div>
                              ),
                            ) ||
                              /* Fallback to File objects if savedImageData not available */
                              question.images.map((file, imageIndex) => (
                                <div
                                  key={`file-${imageIndex}`}
                                  className="relative group"
                                >
                                  <img
                                    src={URL.createObjectURL(file)}
                                    alt={`Uploaded ${imageIndex + 1}`}
                                    className="w-full h-24 object-cover rounded-lg border shadow-sm"
                                  />
                                  <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    onClick={() =>
                                      removeImage(question.id, imageIndex)
                                    }
                                    className="absolute top-1 right-1 h-6 w-6 p-0 bg-red-500 text-white hover:bg-red-600 opacity-0 group-hover:opacity-100 transition-opacity"
                                  >
                                    <X className="h-3 w-3" />
                                  </Button>
                                  <p className="text-xs text-gray-500 mt-1 truncate">
                                    {file.name}
                                  </p>
                                </div>
                              ))}
                          </div>
                        )}
                      </div>
                    )}

                  {index < referralData.questions.length - 1 && (
                    <hr className="border-gray-200 my-8" />
                  )}
                </div>
              ))}
            </div>

            <div className="mt-8 flex justify-end">
              <Button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3"
              >
                {isSubmitting ? (
                  <div className="flex items-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    {isEditMode ? "Updating..." : "Saving..."}
                  </div>
                ) : (
                  <div className="flex items-center">
                    <Save className="mr-2 h-5 w-5" />
                    {isEditMode
                      ? "Update Referral Questions"
                      : "Save Referral Questions"}
                  </div>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Success Dialog */}
        <Dialog open={showSuccessDialog} onOpenChange={setShowSuccessDialog}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle className="flex items-center text-xl text-green-600">
                <Check className="mr-3 h-6 w-6" />
                Success!
              </DialogTitle>
            </DialogHeader>
            <div className="py-4">
              <div className="flex items-center justify-center mb-4">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                  <Check className="w-8 h-8 text-green-600" />
                </div>
              </div>
              <div className="text-center space-y-3">
                <h3 className="text-lg font-semibold text-gray-900">
                  {isEditMode
                    ? "Referral Questions Updated"
                    : "Referral Questions Saved"}
                </h3>
                <p className="text-gray-600">
                  {isEditMode
                    ? "Step 4 has been updated successfully. Your changes have been saved."
                    : "Step 4 has been completed successfully. You can now proceed to the next step."}
                </p>
              </div>
            </div>
            <div className="flex space-x-3">
              <Button
                variant="outline"
                onClick={() => setShowSuccessDialog(false)}
                className="flex-1"
              >
                Stay Here
              </Button>
              <Button
                onClick={() => navigate("/dashboard")}
                className="flex-1 bg-green-600 hover:bg-green-700 text-white"
              >
                Return to Dashboard
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
