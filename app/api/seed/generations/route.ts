import { NextRequest, NextResponse } from 'next/server';
import { ConvexClient } from 'convex/browser';
import { api } from '@/convex/_generated/api';

const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL;

/**
 * 开发用的临时 API - 直接生成模拟数据到 Convex
 * GET /api/seed/generations?count=50&userId=xxx
 *
 * 注意：此 API 仅用于开发测试，生产环境应删除
 */
export async function GET(req: NextRequest) {
  try {
    // Get parameters
    const { searchParams } = new URL(req.url);
    const count = parseInt(searchParams.get('count') || '50', 10);
    const userId = searchParams.get('userId');

    if (!convexUrl) {
      return NextResponse.json(
        { error: 'Convex URL not configured', code: 500 },
        { status: 500 }
      );
    }

    if (!userId) {
      return NextResponse.json(
        { error: 'userId is required', code: 400 },
        { status: 400 }
      );
    }

    // Create Convex client
    const convex = new ConvexClient(convexUrl);

    // 测试数据
    const textToImagePrompts = [
      "A serene Japanese zen garden with cherry blossoms falling",
      "Cyberpunk neon city street at rainy night",
      "Cute corgi puppy wearing a bowtie, professional photo",
      "Abstract fluid art with purple and gold swirls",
      "Medieval castle on a cliff overlooking stormy seas",
      "Minimalist modern living room with floor-to-ceiling windows",
      "Astronaut floating in space with Earth reflection in helmet",
      "Vintage vinyl record player with warm lighting",
      "Tropical beach paradise with crystal clear turquoise water",
      "Steampunk mechanical butterfly with intricate gears",
      "Watercolor painting of lavender fields in Provence",
      "Dark fantasy forest with bioluminescent plants",
      "Art deco style portrait of a flapper girl",
      "Futuristic flying car in a sleek metropolis",
      "Cozy cottage interior with fireplace and books",
      "Majestic lion portrait with dramatic lighting",
      "Colorful hot air balloons over Cappadocia at sunrise",
      "Retro 80s synthwave landscape with grid floor",
      "Delicate origami crane made of cherry blossom petals",
      "Underwater coral reef with tropical fish",
    ];

    const imageToImagePrompts = [
      "Transform into Van Gogh style oil painting",
      "Convert to black and white noir film aesthetic",
      "Apply anime manga art style",
      "Transform into watercolor illustration",
      "Make it look like a 1980s polaroid photo",
      "Apply impressionist painting style",
      "Convert to pixel art game style",
      "Transform into Art Nouveau poster",
      "Apply cyberpunk neon filter",
      "Make it look like a Renaissance painting",
      "Convert to paper cutout art style",
      "Apply Studio Ghibli animation style",
      "Transform into low poly 3D render",
      "Make it look like a 1950s magazine ad",
      "Apply surrealist dreamlike quality",
    ];

    const aspectRatios = ["1:1", "16:9", "9:16", "4:3", "3:4", "21:9", "2:3"];
    const qualities = ["standard", "high", "ultra"];
    const resolutions = ["1K", "2K", "4K"];
    const statuses = ["success", "success", "success", "success", "failed"];

    const now = Date.now();
    const oneDay = 24 * 60 * 60 * 1000;
    const createdIds = [];

    // Generate data
    for (let i = 0; i < count; i++) {
      const isTextToImage = Math.random() > 0.3;
      const mode = isTextToImage ? "text-to-image" : "image-to-image";
      const prompts = isTextToImage ? textToImagePrompts : imageToImagePrompts;
      const prompt = prompts[Math.floor(Math.random() * prompts.length)];

      const daysAgo = Math.floor(Math.random() * 60);
      const createdAt = now - (daysAgo * oneDay) - Math.floor(Math.random() * oneDay);

      const status = statuses[Math.floor(Math.random() * statuses.length)];
      const aspectRatio = aspectRatios[Math.floor(Math.random() * aspectRatios.length)];
      const resolution = resolutions[Math.floor(Math.random() * resolutions.length)];
      const quality = qualities[Math.floor(Math.random() * qualities.length)];
      const creditsUsed = resolution === "4K" ? 2 : 1;
      const imageSeed = i + Math.floor(Math.random() * 1000);
      const outputImage = status === "success"
        ? `https://picsum.photos/seed/${imageSeed}/400/400`
        : "";

      // Create generation
      const generationId = await convex.mutation(api.generations.createGeneration, {
        userId: userId as any,
        mode,
        prompt,
        size: resolution,
        resolution,
        quality,
        aspectRatio,
        creditsUsed,
      });

      // Update with status and images
      if (status === "success" && generationId) {
        await convex.mutation(api.generations.updateGenerationStatus, {
          generationId,
          status: "success",
          outputImage,
          outputImages: [outputImage],
        });
      }

      createdIds.push(generationId);
    }

    // Close client
    convex.close();

    return NextResponse.json({
      success: true,
      created: createdIds.length,
      userId,
    });
  } catch (error) {
    console.error('Seed error:', error);
    return NextResponse.json(
      { error: 'Internal server error', code: 500 },
      { status: 500 }
    );
  }
}
