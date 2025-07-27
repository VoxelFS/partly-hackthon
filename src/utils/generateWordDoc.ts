import { Document, Packer, Paragraph, TextRun, HeadingLevel, BorderStyle } from 'docx';
import type { PartWithCheckState } from '../app/[vehicleId]/page';

const generatePartContent = (part: PartWithCheckState, level: number = 0): Paragraph[] => {
  const paragraphs: Paragraph[] = [];
  
  // Add the part name and status
  paragraphs.push(
    new Paragraph({
      heading: level === 0 ? HeadingLevel.HEADING_2 : HeadingLevel.HEADING_3,
      spacing: { before: 200, after: 100 },
      indent: { left: level * 360 },
      children: [
        new TextRun({
          text: `${part.name}`,
          bold: true,
        }),
        new TextRun({
          text: part.isChecked ? " ✓" : " ✗",
          color: part.isChecked ? "009900" : "FF0000",
        }),
        part.quality
          ? new TextRun({
              text: ` (Grade: ${part.quality})`,
              color: "666666",
            })
          : new TextRun({ text: "" }),
      ],
    })
  );

  // Recursively add child parts
  if (part.parts && part.parts.length > 0) {
    part.parts.forEach((childPart) => {
      paragraphs.push(...generatePartContent(childPart, level + 1));
    });
  }

  return paragraphs;
};

export const generateWordDocument = async (parts: PartWithCheckState[]): Promise<Blob> => {
  const doc = new Document({
    sections: [
      {
        properties: {},
        children: [
          new Paragraph({
            heading: HeadingLevel.HEADING_1,
            text: "Parts Inspection Checklist",
            spacing: { after: 400 },
          }),
          ...parts.flatMap((part) => generatePartContent(part)),
          new Paragraph({
            text: `Generated on ${new Date().toLocaleDateString()}`,
            spacing: { before: 400 },
            border: {
              top: { style: BorderStyle.SINGLE, size: 1, color: "999999" },
            },
          }),
        ],
      },
    ],
  });

  return await Packer.toBlob(doc);
};
