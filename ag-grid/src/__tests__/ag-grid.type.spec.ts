import { jest } from '@jest/globals';
/* eslint-disable prettier/prettier */
import * as $ from '../ag-grid.type';

class Test {
  testField: string;
}

class TestConnection implements $.IConnection {
  name = '';
  nodes = [];
  pageData = new $.PageDataAgGrid();
}

describe('AgGrid Gql type test', () => {
  it('Check creation', async () => {
    const testAGGridType = $.default<Test>(Test);
    const classed = new testAGGridType();

    expect(testAGGridType).toBeDefined();
    expect(classed).toBeDefined();
  });

  it('Check already existing typemap', async () => {
    $.typeMap['Test'] = TestConnection;
    const testAGGridType = $.default<Test>(Test);
    
    // Instantiate to cover PageDataAgGrid statement
    const testConn = new TestConnection();
    expect(testConn.pageData).toBeDefined();

    expect(testAGGridType).toBeDefined();
    delete $.typeMap['Test'];
  });
});
