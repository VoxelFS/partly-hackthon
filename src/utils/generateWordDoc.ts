import { Document, Packer, Paragraph, TextRun, HeadingLevel, BorderStyle } from 'docx';
import type { PartWithCheckState } from '../app/[vehicleId]/page';
import { get } from 'http';
import { getVehicle } from '@/actions/getVehicle';

interface VehicleProperty {
  [key: string]: string;
}

interface VehicleVariant {
  id: string;
  properties: VehicleProperty[];
  uvdb_property_ids: string[];
}

interface VehicleInfo {
  uvdb_vehicle_definitions: any[];
  chassis_number: string;
  variants: VehicleVariant[];
}

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

export const generateWordDocument = async (parts: PartWithCheckState[], licensePlate: string): Promise<Blob> => {

  const vehicleInfo: VehicleInfo = await getVehicle(licensePlate);

  const doc = new Document({
    sections: [
      {
        properties: {},
        children: [
          new Paragraph({
            heading: HeadingLevel.HEADING_1,
            text: "Parts Inspection Checklist",
            spacing: { after: 200 },
          }),
          // Vehicle Information Section
          new Paragraph({
            spacing: { before: 200, after: 200 },
            children: [
              new TextRun({
                text: "Vehicle Details",
                bold: true,
                size: 28,
                break: 1
              }),
              new TextRun({
                text: `License Plate: ${licensePlate.toUpperCase()}`,
                size: 24,
                break: 1
              }),
              new TextRun({
                text: `Make: ${vehicleInfo.variants[0].properties.find((p: VehicleProperty) => 'make' in p)?.['make']?.toUpperCase() || 'N/A'}`,
                size: 24,
                break: 1
              }),
              new TextRun({
                text: `Model: ${vehicleInfo.variants[0].properties.find((p: VehicleProperty) => 'model' in p)?.['model'] || 'N/A'}`,
                size: 24,
                break: 1
              }),
              new TextRun({
                text: `Year: ${vehicleInfo.variants[0].properties.find((p: VehicleProperty) => 'production_year' in p)?.['production_year'] || 'N/A'}`,
                size: 24,
                break: 1
              }),
              new TextRun({
                text: `Body Type: ${vehicleInfo.variants[0].properties.find((p: VehicleProperty) => 'body_type' in p)?.['body_type'] || 'N/A'}`,
                size: 24,
                break: 1
              }),
              new TextRun({
                text: `Engine: ${vehicleInfo.variants[0].properties.find((p: VehicleProperty) => 'engine' in p)?.['engine'] || 'N/A'}`,
                size: 24,
                break: 1
              }),
              new TextRun({
                text: `Chassis Number: ${vehicleInfo.chassis_number}`,
                size: 24,
                break: 1
              }),
            ],
            border: {
              bottom: { style: BorderStyle.SINGLE, size: 1, color: "999999" },
            },
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
