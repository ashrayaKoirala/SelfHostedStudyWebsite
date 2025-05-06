import { StudyPlanData } from '../types';
import { format } from 'date-fns'; // Import format function

// Get today's date in 'yyyy-MM-dd' format
const todayStr = format(new Date(), 'yyyy-MM-dd');

// Example: If you want to shift the existing plan to start from today,
// you'd need a more complex logic to remap all dates in daily_study_plan
// and exam_schedule relative to the new start_date.
// For simplicity, this example just sets the start_date to today
// and adds a placeholder task for today if not already present.

// A function to create a dynamic daily study plan starting from today
const createDynamicDailyStudyPlan = (startDate: string, originalPlan: Record<string, string>, daysToPlan: number = 7): Record<string, string> => {
    const newPlan: Record<string, string> = {};
    const baseDate = new Date(startDate); // Ensure this is a valid date string for Date constructor

    // Try to carry over some tasks from the original plan if their relative day matches
    const originalStartDate = new Date("2025-05-04"); // The original start date of your plan

    for (let i = 0; i < daysToPlan; i++) {
        const currentDate = new Date(baseDate);
        currentDate.setDate(baseDate.getDate() + i);
        const currentDateStr = format(currentDate, 'yyyy-MM-dd');

        // Attempt to find a corresponding task from the original plan
        const originalPlanDate = new Date(originalStartDate);
        originalPlanDate.setDate(originalStartDate.getDate() + i);
        const originalPlanDateStr = format(originalPlanDate, 'yyyy-MM-dd');

        if (originalPlan[originalPlanDateStr]) {
            newPlan[currentDateStr] = originalPlan[originalPlanDateStr];
        } else {
            // Fallback task if no corresponding original task
            newPlan[currentDateStr] = `Review ${['Physics', 'Maths', 'Comp Sci'][i % 3]} - Day ${i + 1}`;
        }
    }
    return newPlan;
};


export const studyPlanData: StudyPlanData = {
  start_date: todayStr, // Set start_date to today
  daily_study_plan: createDynamicDailyStudyPlan(todayStr, {
    // Original tasks, which createDynamicDailyStudyPlan will try to map
    "2025-05-04": "Physics Unit 4",
    "2025-05-05": "Physics Unit 5",
    "2025-05-06": "Maths D1",
    "2025-05-07": "Computer Science Paper 3",
    "2025-05-08": "Maths P3",
    "2025-05-09": "Maths P4",
    "2025-05-10": "Physics Unit 6 Concepts",
    "2025-05-11": "Maths S1",
    // Add more original tasks if needed for a longer dynamic plan
  }, 14), // Plan for the next 14 days dynamically
  daily_past_papers_target: 4,
  exam_schedule: {
    // IMPORTANT: You'll likely want to adjust exam_schedule dates as well
    // if the study plan itself is shifting significantly.
    // For now, exam_schedule remains static, but the 'days_left'
    // calculations in components should handle this based on the current date.
    "Physics": [
      {
        "paper": "Physics Unit 4",
        "date": "2025-05-29", // Keep original exam dates or update as needed
        "time": "11:30 - 13:15",
        "code": "WPH14 01",
        "days_left": 0 // days_left will be recalculated dynamically in components
      },
      {
        "paper": "Physics Unit 5",
        "date": "2025-06-04",
        "time": "08:30 - 10:15",
        "code": "WPH15 01",
        "days_left": 0
      },
      {
        "paper": "Physics Unit 6 (Practical)",
        "date": "2025-06-09",
        "time": "09:00 - 10:20",
        "code": "WPH16 01",
        "days_left": 0
      }
    ],
    "Mathematics": [
      {
        "paper": "Maths D1: Decision 1",
        "date": "2025-05-15",
        "time": "11:30 - 13:00",
        "code": "WDM11 01",
        "days_left": 0
      },
      {
        "paper": "Maths P3: Pure 3",
        "date": "2025-05-29",
        "time": "09:00 - 10:30",
        "code": "WMA13 01",
        "days_left": 0
      },
      {
        "paper": "Maths P4: Pure 4",
        "date": "2025-06-05",
        "time": "11:30 - 13:00",
        "code": "WMA14 01",
        "days_left": 0
      }
    ],
    "Computer Science": [
      {
        "paper": "Comp Sci Paper 3 (Advanced Theory)",
        "date": "2025-05-21",
        "time": "11:30 - 13:00",
        "code": "9618 32",
        "days_left": 0
      },
      {
        "paper": "Comp Sci Paper 4 (Practical)",
        "date": "2025-05-23",
        "time": "09:00 - 11:30",
        "code": "9618 42",
        "days_left": 0
      }
    ]
  }
};
