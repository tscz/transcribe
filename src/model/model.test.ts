import { mergeSections, Section, SectionType } from "./model";

it("can merge sections", () => {
  const section1: Section = {
    measures: ["1", "2", "3", "4"],
    type: SectionType.INTRO
  };
  const section2: Section = {
    measures: ["3"],
    type: SectionType.VERSE
  };
  const section3: Section = {
    measures: ["6"],
    type: SectionType.VERSE
  };

  const expectedResult: Section[] = [
    { measures: ["1", "2"], type: SectionType.UNDEFINED },
    section2,
    { measures: ["4"], type: SectionType.UNDEFINED }
  ];

  const expectedResult2: Section[] = [
    { measures: ["1", "2", "3", "4", "5"], type: SectionType.UNDEFINED },
    section3
  ];

  expect(mergeSections(section1, section2)).toEqual(expectedResult);
  expect(mergeSections(section1, section3)).toEqual(expectedResult2);
});
