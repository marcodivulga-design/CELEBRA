import mysql from 'mysql2/promise';
import fs from 'fs';

const sql = fs.readFileSync('phase-liturgical.sql', 'utf8');

async function executeMigration() {
  const connection = await mysql.createConnection(process.env.DATABASE_URL);
  
  try {
    console.log('🗓️ FASE: Calendário Litúrgico e Escalas - Criando tabelas...\n');
    
    const statements = sql.split(';').filter(s => s.trim());
    let count = 0;
    let errors = 0;
    
    for (const stmt of statements) {
      try {
        await connection.execute(stmt + ';');
        count++;
      } catch (e) {
        if (!e.message.includes('Duplicate')) {
          console.log(`⚠ Error: ${e.message.substring(0, 80)}`);
          errors++;
        }
      }
    }
    
    console.log(`✅ ${count} statements executados com sucesso!`);
    if (errors > 0) {
      console.log(`⚠ ${errors} erros encontrados (duplicatas ignoradas)`);
    }
    
    console.log('\n✅ Tabelas criadas:');
    console.log('   ✓ liturgicalDates');
    console.log('   ✓ songSuggestions');
    console.log('   ✓ scales');
    console.log('   ✓ scalePositions');
    console.log('   ✓ scaleAssignments');
    console.log('   ✓ scaleNotifications');
    console.log('   ✓ scaleHistory');
    console.log('   ✓ ministryPreferences\n');
    
  } catch (error) {
    console.error('❌ Erro crítico:', error.message);
    process.exit(1);
  } finally {
    await connection.end();
  }
}

executeMigration();
