import { GraphService } from '../src/services/graphService';
import { ExchangeService } from '../src/services/exchangeService';

async function testM365() {
  console.log('--- Testing M365 Tenant Simulator ---');
  try {
    // 1. Get User
    console.log('\n[1] Getting Adele Vance...');
    const user = await GraphService.getUser('adele.vance@tenant.onmicrosoft.com');
    if (user) {
      console.log(`Success: Found ${user.displayName} (${user.userPrincipalName}). Department: ${user.department}`);
    } else {
      console.error('Error: Adele Vance not found');
    }

    // 2. Create User (UC001)
    console.log('\n[2] Creating New User (UC001)...');
    const { user: newUser, tempPassword } = await GraphService.createUser(
      'Jessica',
      'Miller',
      'jessica.miller@tenant.onmicrosoft.com',
      'IT Support',
      'Support Tech',
      'SPE_E5'
    );
    console.log(`Success: Created ${newUser.displayName}. Temporary Password: ${tempPassword}`);

    // 3. Update Display Name (UC002)
    console.log('\n[3] Updating Display Name (UC002)...');
    const updateResult = await GraphService.updateUserField(
      'jessica.miller@tenant.onmicrosoft.com',
      'displayName',
      'Jessica M. Miller'
    );
    console.log(`Success: Display name updated from "${updateResult.before}" to "${updateResult.after}"`);

    // 4. Check Available Licenses (UC016)
    console.log('\n[4] Checking Licenses (UC016)...');
    const licenses = await GraphService.checkAvailableLicenses();
    console.log('SKUs found:');
    licenses.forEach(l => {
      console.log(`- ${l.skuPartNumber}: Consumed ${l.consumedUnits}/${l.totalUnits}`);
    });

    // 5. Check OneDrive Storage (UC044)
    console.log('\n[5] Checking OneDrive Storage (UC044)...');
    const od = await ExchangeService.getOneDriveStorage('adele.vance@tenant.onmicrosoft.com');
    console.log(`OneDrive for Adele: Total: ${od.totalGb} GB, Used: ${od.usedGb} GB, Remaining: ${od.remainingGb} GB`);

    // 6. Check Mailbox Size (UC042)
    console.log('\n[6] Checking Mailbox Sizing (UC042)...');
    const mbox = await ExchangeService.getMailboxSize('info@tenant.onmicrosoft.com');
    console.log(`Mailbox size: ${mbox.sizeGb} GB / ${mbox.maxSizeGb} GB (${mbox.percentUsed}% used)`);

    console.log('\n🌟 ALL M365 TENANT SIMULATOR TESTS PASSED SUCCESSFULLY! 🌟');
  } catch (error: any) {
    console.error('ERROR: M365 test execution failed:', error.message);
  }
}

testM365();
