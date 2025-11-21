const numberingConfig = {
  config: [
    // 1. decimal
    {
      reference: "decimal",
      levels: [
        {
          level: 0,
          format: "decimal",
          text: "%1.",
        },
      ],
    },

    // 2. lower-alpha (a, b, c)
    {
      reference: "lower-alpha",
      levels: [
        {
          level: 0,
          format: "lowerLetter",
          text: "%1.",
        },
      ],
    },

    // 3. upper-alpha (A, B, C)
    {
      reference: "upper-alpha",
      levels: [
        {
          level: 0,
          format: "upperLetter",
          text: "%1.",
        },
      ],
    },

    // 4. lower-roman (i, ii, iii)
    {
      reference: "lower-roman",
      levels: [
        {
          level: 0,
          format: "lowerRoman",
          text: "%1.",
        },
      ],
    },

    // 5. upper-roman (I, II, III)
    {
      reference: "upper-roman",
      levels: [
        {
          level: 0,
          format: "upperRoman",
          text: "%1.",
        },
      ],
    },
  ],
};
