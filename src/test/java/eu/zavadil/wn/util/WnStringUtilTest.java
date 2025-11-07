package eu.zavadil.wn.util;

import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.Test;

class WnStringUtilTest {

	@Test
	void testReplaceQuotes() {
		Assertions.assertEquals("test some words", WnStringUtil.replaceQuotes("test some words"));
		Assertions.assertEquals("test „quoted“ test", WnStringUtil.replaceQuotes("test \"quoted\" test"));
		Assertions.assertEquals("„quoted“ test", WnStringUtil.replaceQuotes("\"quoted\" test"));
		Assertions.assertEquals("„quoted“", WnStringUtil.replaceQuotes("\"quoted\""));
		Assertions.assertEquals("test „quoted“", WnStringUtil.replaceQuotes("test \"quoted\""));
		Assertions.assertEquals(
			"start „quoted1“ and „quoted2“ end",
			WnStringUtil.replaceQuotes(
				"start \"quoted1\" and \"quoted2\" end"
			)
		);
	}

}
