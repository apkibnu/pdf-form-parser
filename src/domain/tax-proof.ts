export interface IDataH {
  h1?: string;
  h2: { status?: boolean; num?: number };
}

export interface IDataA {
  a1?: string;
  a2?: string;
  a3?: string;
}

export interface IDataB {
  b1?: string;
  b2?: string;
  b3?: number;
  b4?: string;
  b5?: number;
  b6?: number;
  b7: {
    docNo?: string;
    docName?: string;
    date?: Date;
  };
  b8: {
    docNo?: string;
    date?: Date;
  };
  b9: {
    status?: boolean;
    docNo?: string;
    date?: Date;
  };
  b10: {
    status?: boolean;
    desc?: string;
  };
  b11: {
    status?: boolean;
    desc?: string;
  };
  b12: {
    status?: boolean;
    desc?: string;
  };
}

export interface IDataC {
  c1?: string;
  c2?: string;
  c3?: Date;
  c4?: string;
  c5: {
    opt1?: boolean;
    opt2?: boolean;
  };
}

export interface ITaxProof {
  h: IDataH;
  a: IDataA;
  b: IDataB;
  c: IDataC;
}

export class TaxProof {
  private props: ITaxProof;

  constructor(props: ITaxProof) {
    this.props = props;
  }

  public static create(props: ITaxProof): TaxProof {
    return new TaxProof(props);
  }

  public unmarshal(): ITaxProof {
    return {
      h: this.h,
      a: this.a,
      b: this.b,
      c: this.c,
    };
  }

  get h(): IDataH {
    return this.props.h;
  }

  get a(): IDataA {
    return this.props.a;
  }

  get b(): IDataB {
    return this.props.b;
  }

  get c(): IDataC {
    return this.props.c;
  }
}
