int n = text.length < 511 ? text.length : 511;
int compact = ready?left:right;
int nested = first ? second ? 1 : 2 : 3;
int multiline = ready
  ? left
  : right;
char *question = "?";
// ?
/* ? */
