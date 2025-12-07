import { prisma } from "./prisma";

export interface DrawAssignment {
  giverId: string;
  receiverId: string;
}

export async function generateDraw(eventId: string): Promise<DrawAssignment[]> {
  const participants = await prisma.participant.findMany({
    where: { eventId },
  });

  console.log(
    `Generating draw for event ${eventId}, participants: ${participants.length}`,
  );

  if (participants.length < 2) {
    throw new Error("Not enough participants for a draw");
  }

  // Fetch exclusions
  const exclusions = await prisma.exclusion.findMany({
    where: {
      giver: {
        eventId,
      },
      excluded: {
        eventId,
      },
    },
  });

  // Build exclusion map: giverId -> set of excluded receiverIds
  const exclusionMap = new Map<string, Set<string>>();
  for (const exclusion of exclusions) {
    if (!exclusionMap.has(exclusion.giverId)) {
      exclusionMap.set(exclusion.giverId, new Set());
    }
    exclusionMap.get(exclusion.giverId)!.add(exclusion.excludedId);
  }

  const maxAttempts = 1000;
  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    // Shuffle the participants for givers
    const givers = [...participants].sort(() => Math.random() - 0.5);
    // Shuffle another copy for receivers
    const receivers = [...participants].sort(() => Math.random() - 0.5);

    // Assign giver[i] to receiver[i]
    const assignments: DrawAssignment[] = [];
    let valid = true;
    for (let i = 0; i < givers.length; i++) {
      const giver = givers[i];
      const receiver = receivers[i];
      const excluded = exclusionMap.get(giver.id);
      if (giver.id === receiver.id || excluded?.has(receiver.id)) {
        valid = false;
        break;
      }
      assignments.push({
        giverId: giver.id,
        receiverId: receiver.id,
      });
    }

    if (valid) {
      return assignments;
    }
  }

  console.log(
    `Failed to generate valid draw for event ${eventId} after ${maxAttempts} attempts`,
  );
  throw new Error(
    "Unable to generate a valid draw respecting all exclusions after multiple attempts",
  );
}
