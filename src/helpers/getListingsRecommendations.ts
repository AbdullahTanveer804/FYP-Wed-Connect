import { IListing } from "@/app/model/listingModel";
import { GoogleGenerativeAI } from "@google/generative-ai";



// Initialize Gemini with your API key
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

export async function getListingRecommendations({
  prompt,
  budget,
  style,
  location,
  category,
  listings,
}: {
  prompt: string;
  budget: number;
  style?: string;
  location?: string;
  category?: string[];
  listings: IListing[]
}) {
  try {
    if (!listings || listings.length === 0) {
      console.error("No listings provided for recommendations");
      throw new Error("No listings available to process recommendations");
    }

    // Update to explicitly specify the model version
    const model = genAI.getGenerativeModel({
      model: "gemini-2.0-flash",
      generationConfig: {
        temperature: 0.7,
        maxOutputTokens: 2048,
      },
    });

    // Transform listings data into AI-friendly structure
    const listingData = listings.map(listing => ({
      id: (listing._id as string | number | { toString(): string }).toString(),
      title: listing.title,
      description: listing.description,
      expertise: listing.expertise || [],
      duration: listing.duration,
      staff: listing.staff,
      categoryId: listing.categoryId.toString(),
      packages: listing.packages.map(pkg => ({
        name: pkg.name,
        description: pkg.description,
        price: pkg.price,
        venueCapacity: pkg.venueCapacity || null,
      })),
      priceRange: {
        min: listing.pricing.minPrice,
        max: listing.pricing.maxPrice,
      },
      location: listing.location.city,
      rating: listing.totalRating,
      featured: listing.featured,
    }));

    // Prepare the full prompt
    const userPrompt = `
You are a wedding planning assistant. A couple is looking for ideal wedding service listings.

User preferences:
- Budget: PKR ${budget}
${style ? `- Style preference: ${style}` : ""}
${location ? `- Location: ${location}` : ""}
${category && category.length > 0 ? `- Categories: ${category.join(", ")}` : ""}
- Extra preferences: ${prompt}

Here are available listings:
${JSON.stringify(listingData, null, 2)}

Based on the couple’s preferences and listings provided, recommend the most suitable listings.

Respond strictly in this JSON format:
{
  "recommendations": [
    {
      "listingId": "string",
      "title": "string",
      "matchReason": "string (why this was recommended)",
      "matchScore": number (0–100)
    }
  ],
  "summary": "string (overview of the recommendations)"
}
`;

    // Send to Gemini
    const result = await model.generateContent(userPrompt);
    const response = await result.response;
    const text = response.text();

    // Enhanced JSON parsing
    try {
      // Find the first '{' and last '}'
      const jsonStart = text.indexOf('{');
      const jsonEnd = text.lastIndexOf('}') + 1;
      if (jsonStart === -1 || jsonEnd === 0) {
        throw new Error('No valid JSON object found in response');
      }
      const jsonString = text.slice(jsonStart, jsonEnd);
      const recommendations = JSON.parse(jsonString);
      return recommendations;
    } catch (jsonError) {
      console.error('Error parsing Gemini response:', text);
      throw new Error('Failed to parse recommendation response from Gemini AI');
    }
  } catch (error: any) {
    console.error("Gemini recommendation error:", error.message);
    throw new Error("Failed to get listing recommendations from Gemini AI.");
  }
}
