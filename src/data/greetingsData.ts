// src/data/greetingsData.ts

export type TimeOfDay = 'morning' | 'afternoon' | 'evening' | 'night'; // Added night
export type CompanionStyle = 'default' | 'sakura' | 'akira' | 'takeshi' | 'mizuki' | 'ren' | 'hana' | 'yuki'; // Add all relevant companion IDs/styles

export interface Greeting {
    text: string;
    companionStyle: CompanionStyle; // To match styling with the companion who provided the current quote
}

// {userName} will be replaced with the actual user name if available
export const greetings: Record<TimeOfDay, Greeting[]> = {
    morning: [
        { text: "Good morning! Ready to conquer the day, {userName}?", companionStyle: 'default' },
        { text: "The early bird gets the worm, {userName}! Let's get to it.", companionStyle: 'takeshi' },
        { text: "A fresh start, a new challenge. Embrace it, {userName}!", companionStyle: 'akira' },
        { text: "May your coffee be strong and your focus unwavering, {userName}.", companionStyle: 'mizuki' },
        { text: "The canvas of the morning awaits your masterpiece, {userName}.", companionStyle: 'sakura' },
        { text: "Greet the dawn with a calm mind and a ready spirit, {userName}.", companionStyle: 'ren' },
        { text: "Morning, {userName}! Time to shine like the rising sun.", companionStyle: 'hana' },
        { text: "Rise and grind, {userName}! Today's an opportunity.", companionStyle: 'yuki' },
        { text: "おはよう, {userName}! A brand new day for learning awaits.", companionStyle: 'default'},
        { text: "Seize the morning, {userName}! Your future self will thank you.", companionStyle: 'takeshi'},
    ],
    afternoon: [
        { text: "Good afternoon, {userName}! Keep that momentum going.", companionStyle: 'default' },
        { text: "The afternoon is a battlefield of focus, {userName}. Stay sharp!", companionStyle: 'takeshi' },
        { text: "Halfway through the day, {userName}! Let's finish strong.", companionStyle: 'akira' },
        { text: "Hope your afternoon is productive and insightful, {userName}.", companionStyle: 'mizuki' },
        { text: "The afternoon sun shines on your efforts, {userName}.", companionStyle: 'sakura' },
        { text: "Find your rhythm this afternoon, {userName}. Flow with your tasks.", companionStyle: 'ren' },
        { text: "Afternoon, {userName}! Still plenty of time to make progress.", companionStyle: 'hana' },
        { text: "Keep pushing, {userName}! The afternoon is yours.", companionStyle: 'yuki' },
        { text: "こんにちは, {userName}! Keep up the great work.", companionStyle: 'default'},
        { text: "The afternoon is prime time for breakthroughs, {userName}.", companionStyle: 'takeshi'},
    ],
    evening: [
        { text: "Good evening, {userName}. Winding down or gearing up for more?", companionStyle: 'default' },
        { text: "The evening is a time for reflection and preparation, {userName}.", companionStyle: 'takeshi' },
        { text: "As the day ends, {userName}, review your victories.", companionStyle: 'akira' },
        { text: "Hope you had a fulfilling day, {userName}. Evening studies can be serene.", companionStyle: 'mizuki' },
        { text: "The stars begin to emerge, as does your wisdom, {userName}.", companionStyle: 'sakura' },
        { text: "A peaceful evening to you, {userName}. May your mind be clear.", companionStyle: 'ren' },
        { text: "Evening, {userName}! One last push or a well-deserved rest?", companionStyle: 'hana' },
        { text: "The day's almost done, {userName}. Make these hours count.", companionStyle: 'yuki' },
        { text: "こんばんは, {userName}! Time to consolidate your learning.", companionStyle: 'default'},
        { text: "Even as the sun sets, your dedication shines, {userName}.", companionStyle: 'takeshi'},
    ],
    night: [ // Added night greetings
        { text: "Burning the midnight oil, {userName}? Remember to rest too.", companionStyle: 'default' },
        { text: "The night is quiet, perfect for deep focus, {userName}. But don't overdo it.", companionStyle: 'takeshi' },
        { text: "Late night session, {userName}? True dedication. Ensure you get enough sleep.", companionStyle: 'akira' },
        { text: "Studying under the stars, {userName}? May your thoughts be clear.", companionStyle: 'mizuki' },
        { text: "The moon watches over your diligent efforts, {userName}.", companionStyle: 'sakura' },
        { text: "In the quiet of the night, knowledge whispers, {userName}.", companionStyle: 'ren' },
        { text: "Working late, {userName}? Your commitment is admirable.", companionStyle: 'hana' },
        { text: "The world sleeps, but your ambition is wide awake, {userName}.", companionStyle: 'yuki' },
        { text: "おやすみなさい, {userName}, if you're heading off. If not, study well!", companionStyle: 'default'},
        { text: "Respect the grind, {userName}, even into the late hours.", companionStyle: 'takeshi'},
    ]
};

export function getGreeting(timeOfDay: TimeOfDay, companionStyle: CompanionStyle = 'default', userName: string | null = null): string {
    const possibleGreetings = greetings[timeOfDay];
    // FIX: Removed hyphen between 'let' and 'passendeGreetings'
    let passendeGreetings = possibleGreetings.filter(g => g.companionStyle === companionStyle);

    if (passendeGreetings.length === 0) {
        // Fallback to default style if no specific companion style greetings are found for that time
        passendeGreetings = possibleGreetings.filter(g => g.companionStyle === 'default');
    }
    if (passendeGreetings.length === 0) {
        // Fallback to any greeting for that time if no default style is found (should not happen with current data)
        passendeGreetings = possibleGreetings;
    }

    // Ensure there's at least one greeting to choose from
    if (passendeGreetings.length === 0) {
        console.warn(`No greetings found for time ${timeOfDay} and style ${companionStyle}. Using fallback.`);
        // Provide an absolute fallback if all else fails
        return `Hello${userName ? ', ' + userName : ''}! Keep up the good work.`;
    }


    const randomGreeting = passendeGreetings[Math.floor(Math.random() * passendeGreetings.length)];
    let greetingText = randomGreeting.text;

    if (userName) {
        greetingText = greetingText.replace("{userName}", userName);
    } else {
        // Remove placeholder and adjust sentence if no username (e.g., " Good morning!" -> "Good morning!")
        greetingText = greetingText.replace(", {userName}", "").replace("{userName}", "Samurai"); // Fallback name
    }
    return greetingText;
}

export function getCurrentTimeOfDay(): TimeOfDay {
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 12) return 'morning';
    if (hour >= 12 && hour < 17) return 'afternoon'; // Adjusted afternoon end
    if (hour >= 17 && hour < 22) return 'evening'; // Adjusted evening end
    return 'night'; // For hours like 10 PM to 4 AM
}